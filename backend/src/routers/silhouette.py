"""エンドポイント `/monster`"""
from fastapi import APIRouter, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src.cruds import read_silhouette
from src.db import get_db
from src.types import OutGetSilhouette
from src.utils import binalize_alpha, cropping_image, png_to_base64image

router = APIRouter()


@router.get("/silhouette/{silhouette_id}")
def get_silhouette(
    silhouette_id: int,
    db: Session = Depends(get_db),
    *,
    crop: bool = False,
) -> OutGetSilhouette:
    """エンドポイント `/silhouette/{silhouette_id}`

    Args:
        silhouette_id (int): 取得するシルエットの id
        db (Session, optional): _description_. Defaults to Depends(get_db).
        crop (bool, optional): シルエットサイズに合わせて切り抜くか. Defaults to False.

    Returns:
        OutGetSilhouette: シルエット画像
    """
    db_silhouette = read_silhouette(db=db, silhouette_id=silhouette_id)

    # alpha 値を2値化
    silhouette_image = Image.open(db_silhouette.silhouette_path)
    if silhouette_image.mode != "RGBA":
        raise HTTPException(status_code=500, detail="Invalid image type")
    silhouette_image = binalize_alpha(silhouette_image)

    # cropping silhouette with padding
    if crop:
        silhouette_image = cropping_image(
            silhouette_image,
            padding_w=0.25,
            padding_h=1.00,
        )

    # png => base64
    base64image = png_to_base64image(silhouette_image)

    return OutGetSilhouette(id=db_silhouette.id, base64image=base64image)
