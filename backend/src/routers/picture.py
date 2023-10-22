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
) -> OutGetPicture:
    """エンドポイント `/picture/{picture_id}`

    Args:
        picture_id (int): 取得する撮影画像の id
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetPicture: 撮影画像
    """
    db_picture = read_picture(db=db, picture_id=picture_id)

    # alpha 値を2値化
    picture = Image.open(db_picture.picture_path)
    if picture.mode != "RGBA":
        raise HTTPException(status_code=500, detail="Invalid image type")
    picture = binalize_alpha(picture)

    # cropping silhouette with padding
    picture = cropping_image(picture, padding_w=0.2, padding_h=0.2)

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
        # 撮影画像を処理
        picture = base64image_to_png(requests.base64image)
        picture = Rembg.extract(picture)
        picture = binalize_alpha(picture, high=200)
        picture = filtering_maximum(picture)
        picture = smoothing(picture)

        # シルエット画像を処理
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

        # シルエット画像を撮影画像に内接させるようにリサイズ
        silhouette = resize_to_contain(picture, silhouette)

        # シルエット位置を基準にクロッピング
        position = get_truth_size(silhouette)
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
