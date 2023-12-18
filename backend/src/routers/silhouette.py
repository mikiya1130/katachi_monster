"""エンドポイント `/monster`"""
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, Cookie, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src.core import Rembg, check_user
from src.cruds import create_picture, read_silhouette
from src.db import get_db
from src.models import Picture
from src.types import InPostSilhouette, OutGetSilhouette, OutPostSilhouette
from src.utils import (
    base64image_to_png,
    binalize_alpha,
    calc_iou,
    cropping_image,
    filtering_maximum,
    get_alpha,
    get_truth_size,
    png_to_base64image,
    resize_to_contain,
    smoothing,
)

router = APIRouter()


@router.get("/silhouette/{silhouette_id}")
def get_silhouette(
    silhouette_id: int,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
    *,
    crop: bool = False,
) -> OutGetSilhouette:
    """エンドポイント `/silhouette/{silhouette_id}`

    Args:
        silhouette_id (int): 取得するシルエットの id
        db (Session, optional): DB.
        user_token (str|None, optional): Cookie.
        crop (bool, optional): シルエットサイズに合わせて切り抜くか. Defaults to False.

    Returns:
        OutGetSilhouette: シルエット画像
    """
    check_user(db, user_token)

    db_silhouette = read_silhouette(db=db, silhouette_id=silhouette_id)

    # alpha 値を2値化
    silhouette = Image.open(db_silhouette.silhouette_path)
    if silhouette.mode != "RGBA":
        raise HTTPException(status_code=500, detail="Invalid image type")
    silhouette = binalize_alpha(silhouette)

    # cropping silhouette with padding
    if crop:
        silhouette = cropping_image(silhouette, padding_w=0.25, padding_h=1.00)

    # png => base64
    base64image = png_to_base64image(silhouette)

    return OutGetSilhouette(id=db_silhouette.id, base64image=base64image)


@router.post("/silhouette/{silhouette_id}")
def post_silhouette(
    silhouette_id: int,
    requests: InPostSilhouette,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
) -> OutPostSilhouette:
    """エンドポイント `/silhouette/{silhouette_id}`

    - 物体抽出後の画像を `/images/pictures` ディレクトリ下に保存する
    - 保存先レコードへの id を返す
    - 実行に失敗した場合は、ステータスコード 500 を返す

    Args:
        silhouette_id (int): 対象シルエットの id
        requests (InPostSilhouette): 対象画像の base64image データ
        db (Session, optional): DB.
        user_token (str|None, optional): Cookie.

    Returns:
        OutPostSilhouette: 保存先レコードへの id
    """
    user_id = check_user(db, user_token)

    try:
        # 撮影画像の処理
        picture = base64image_to_png(requests.base64image)
        picture = Rembg.extract(picture)
        picture = binalize_alpha(picture, high=200)
        picture = filtering_maximum(picture)
        picture = smoothing(picture)

        # シルエット画像の処理
        db_silhouette = read_silhouette(db=db, silhouette_id=silhouette_id)
        silhouette = Image.open(db_silhouette.silhouette_path)
        if silhouette.mode != "RGBA":
            raise HTTPException(status_code=500, detail="Invalid image type")
        silhouette = binalize_alpha(silhouette, high=128)
        silhouette = cropping_image(
            silhouette,
            padding_w=0.25,
            padding_h=1.00,
        )

        # 撮影画像をシルエット画像に外接させるようにリサイズ
        # - CSS の object-fit: "cover" に相当
        # - ただし、`picture` を `silhouette` のサイズでトリミングしない
        _, scale = resize_to_contain(picture, silhouette)
        width, height = picture.size
        new_width, new_height = round(width * (1 / scale)), round(height * (1 / scale))
        picture = picture.resize((new_width, new_height))

        # シルエット位置を基準にクロッピング
        position = get_truth_size(silhouette)
        shift_x = (picture.size[0] - silhouette.size[0]) // 2
        shift_y = (picture.size[1] - silhouette.size[1]) // 2
        position.shift(shift_x, shift_y)
        picture = cropping_image(
            picture,
            position=position,
            padding_w=0.2,
            padding_h=0.2,
        )

        # 画像を保存
        time = datetime.now(timezone(timedelta(hours=+9))).strftime("%Y%m%d-%H%M%S-%f")
        picture_path = Path("images/pictures", f"{time}.png")
        picture.save(picture_path)

        try:
            iou = calc_iou(
                get_alpha(picture),
                get_alpha(
                    cropping_image(
                        silhouette,
                        padding_w=0.2,
                        padding_h=0.2,
                    ),
                ),
            )
        except ValueError as e:
            raise HTTPException(status_code=500, detail="Process failed") from e
        if iou < 10:  # 一致率10%未満は弾く
            raise HTTPException(status_code=500, detail="Object not found")

        # DB に反映
        db_picture = Picture(
            user_monster_id=None,
            silhouette_id=silhouette_id,
            user_id=user_id,
            picture_path=str(picture_path),
            match_rate=iou,
        )
        db_picture = create_picture(db=db, db_picture=db_picture)

        return OutPostSilhouette(picture_id=db_picture.id)
    except RuntimeError as e:
        raise HTTPException(status_code=500) from e
