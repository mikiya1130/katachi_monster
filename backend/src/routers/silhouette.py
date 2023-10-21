"""エンドポイント `/monster`"""
from fastapi import APIRouter, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src import types
from src.cruds import read_silhouette
from src.db import get_db
from src.utils import binalize_alpha, png_to_base64image

router = APIRouter()


@router.get("/silhouette/{silhouette_id}")
def get_silhouette_silhouette(
    silhouette_id: int,
    db: Session = Depends(get_db),
) -> types.Silhouette:
    """エンドポイント `/silhouette/{silhouette_id}`

    Args:
        silhouette_id (int): 取得するシルエットの id
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        Silhouette: シルエット画像
    """
    silhouette = read_silhouette(db=db, silhouette_id=silhouette_id)

    # alpha 値を2値化
    silhouette_image = Image.open(silhouette.silhouette_path)
    if silhouette_image.mode != "RGBA":
        raise HTTPException(status_code=500, detail="Invalid image type")
    silhouette_image = binalize_alpha(silhouette_image, high=128)

    # png => base64
    base64image = png_to_base64image(silhouette_image)

    return types.Silhouette(id=silhouette.id, base64image=base64image)  # type: ignore
