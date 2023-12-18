"""エンドポイント `/picture`"""
from fastapi import APIRouter, Cookie, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src.core import check_user
from src.cruds import read_picture, read_silhouette
from src.db import get_db
from src.types import OutGetPicture
from src.utils import binalize_alpha, cropping_image, png_to_base64image

router = APIRouter()


@router.get("/picture/{picture_id}")
def get_picture(
    picture_id: int,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
    *,
    overlap_silhouette: bool = False,
) -> OutGetPicture:
    """エンドポイント `/picture/{picture_id}`

    Args:
        picture_id (int): 取得する撮影画像の id
        db (Session, optional): DB.
        user_token (str|None, optional): Cookie.
        overlap_silhouette (bool, optional):
            透過シルエットを重ねた画像を作成する. Defaults to False.

    Returns:
        OutGetPicture: 撮影画像
    """
    user_id = check_user(db, user_token)

    db_picture = read_picture(db=db, picture_id=picture_id, user_id=user_id)
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

    return OutGetPicture(
        id=db_picture.id,
        base64image=base64image,
        match_rate=db_picture.match_rate,
    )
