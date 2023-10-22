"""エンドポイント `/extract`"""
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src.core import Rembg
from src.cruds import create_image, read_image, read_silhouette
from src.db import get_db
from src.models import Image as DBImage
from src.types import InPostExtract, OutGetExtract, OutPostExtract
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


@router.get("/extract/{image_id}")
def get_extract(
    image_id: int,
    db: Session = Depends(get_db),
) -> OutGetExtract:
    """エンドポイント `/extract/{image_id}`

    Args:
        image_id (int): 取得する撮影画像の id
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetExtract: 撮影画像
    """
    db_image = read_image(db=db, image_id=image_id)

    # alpha 値を2値化
    image = Image.open(db_image.image_path)
    if image.mode != "RGBA":
        raise HTTPException(status_code=500, detail="Invalid image type")
    image = binalize_alpha(image)

    # cropping silhouette with padding
    image = cropping_image(image, padding_w=0.2, padding_h=0.2)

    # png => base64
    base64image = png_to_base64image(image)

    return OutGetExtract(id=db_image.id, base64image=base64image)


@router.post("/extract")
def post_extract(
    requests: InPostExtract,
    db: Session = Depends(get_db),
) -> OutPostExtract:
    """エンドポイント `/extract`

    - 物体抽出後の画像を `/images/pictures` ディレクトリ下に保存する
    - 保存先レコードへの id を返す
    - 実行に失敗した場合は、ステータスコード 500 を返す

    Args:
        requests (InPostExtract): 対象画像の base64image データ
        db (Session, optional): _description_. Defaults to Depends(get_db).
        OutPostExtract: 保存先レコードへの id
    """
    try:
        # 撮影画像を処理
        image = base64image_to_png(requests.base64image)
        extracted_image = Rembg.extract(image)
        extracted_image = binalize_alpha(extracted_image, high=200)
        extracted_image = filtering_maximum(extracted_image)
        extracted_image = smoothing(extracted_image)

        # シルエット画像を処理
        silhouette = read_silhouette(db=db, silhouette_id=requests.silhouette_id)
        silhouette_image = Image.open(silhouette.silhouette_path)
        if silhouette_image.mode != "RGBA":
            raise HTTPException(status_code=500, detail="Invalid image type")
        silhouette_image = binalize_alpha(silhouette_image, high=128)
        silhouette_image = cropping_image(
            silhouette_image,
            padding_w=0.25,
            padding_h=1.00,
        )

        # シルエット画像を撮影画像に内接させるようにリサイズ
        silhouette_image = resize_to_contain(extracted_image, silhouette_image)

        # シルエット位置を基準にクロッピング
        position = get_truth_size(silhouette_image)
        extracted_image = cropping_image(
            extracted_image,
            position=position,
            padding_w=0.2,
            padding_h=0.2,
        )

        # 画像を保存
        time = datetime.now(timezone(timedelta(hours=+9))).strftime("%Y%m%d-%H%M%S-%f")
        image_path = Path("images/pictures", f"{time}.png")
        extracted_image.save(image_path)

        # DB に反映
        db_image = DBImage(
            user_id=1,  # TODO: 修正  # noqa: FIX002
            silhouette_id=requests.silhouette_id,
            image_path=str(image_path),
        )
        db_image = create_image(db=db, db_image=db_image)

        return OutPostExtract(image_id=db_image.id)
    except RuntimeError as e:
        raise HTTPException(status_code=500) from e
