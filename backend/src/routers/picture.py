"""エンドポイント `/picture`"""
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src.core import Rembg
from src.cruds import create_picture, read_picture, read_silhouette
from src.db import get_db
from src.models import Picture
from src.types import InPostPicture, OutGetPicture, OutPostPicture
from src.utils import (
    base64image_to_png,
    binalize_alpha,
    cropping_image,
    filtering_maximum,
    get_truth_size,
    png_to_base64image,
    resize_to_contain,
    smoothing,
)

router = APIRouter()


@router.get("/picture/{picture_id}")
def get_picture(
    picture_id: int,
    db: Session = Depends(get_db),
    *,
    overlap_silhouette: bool = False,
) -> OutGetPicture:
    """エンドポイント `/picture/{picture_id}`

    Args:
        picture_id (int): 取得する撮影画像の id
        db (Session, optional): _description_. Defaults to Depends(get_db).
        overlap_silhouette (bool, optional):
            透過シルエットを重ねた画像を作成する. Defaults to False.

    Returns:
        OutGetPicture: 撮影画像
    """
    db_picture = read_picture(db=db, picture_id=picture_id)
    db_silhouette = read_silhouette(db=db, silhouette_id=db_picture.silhouette_id)

    # 撮影画像の処理
    picture = Image.open(db_picture.picture_path)
    if picture.mode != "RGBA":
        raise HTTPException(status_code=500, detail="Invalid image type")
    picture = binalize_alpha(picture)

    if overlap_silhouette:
        # シルエット画像の処理
        silhouette = Image.open(db_silhouette.silhouette_path)
        if silhouette.mode != "RGBA":
            raise HTTPException(status_code=500, detail="Invalid image type")
        silhouette = binalize_alpha(silhouette, high=100)
        silhouette = cropping_image(
            silhouette,
            padding_w=0.2,
            padding_h=0.2,
        )

        # NOTE: 1ピクセル程度ずれる可能性はありそう?
        if picture.size != silhouette.size:
            raise HTTPException(status_code=500, detail="Not same size")

        # 撮影画像にシルエット画像を重ねる
        picture = Image.alpha_composite(picture, silhouette)

    # png => base64
    base64image = png_to_base64image(picture)

    return OutGetPicture(id=db_picture.id, base64image=base64image)


@router.post("/picture")
def post_picture(
    requests: InPostPicture,
    db: Session = Depends(get_db),
) -> OutPostPicture:
    """エンドポイント `/picture`

    - 物体抽出後の画像を `/images/pictures` ディレクトリ下に保存する
    - 保存先レコードへの id を返す
    - 実行に失敗した場合は、ステータスコード 500 を返す

    Args:
        requests (InPostPicture): 対象画像の base64image データ
        db (Session, optional): _description_. Defaults to Depends(get_db).
        OutPostPicture: 保存先レコードへの id
    """
    try:
        # 撮影画像の処理
        picture = base64image_to_png(requests.base64image)
        picture = Rembg.extract(picture)
        picture = binalize_alpha(picture, high=200)
        picture = filtering_maximum(picture)
        picture = smoothing(picture)

        # シルエット画像の処理
        db_silhouette = read_silhouette(db=db, silhouette_id=requests.silhouette_id)
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

        # DB に反映
        db_picture = Picture(
            user_id=1,  # TODO: 修正  # noqa: FIX002
            silhouette_id=requests.silhouette_id,
            picture_path=str(picture_path),
        )
        db_picture = create_picture(db=db, db_picture=db_picture)

        return OutPostPicture(picture_id=db_picture.id)
    except RuntimeError as e:
        raise HTTPException(status_code=500) from e
