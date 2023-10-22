"""images テーブルの CRUD 関数"""
from sqlalchemy.orm import Session

from src.models import Image


def create_image(db: Session, db_image: Image) -> Image:
    """images テーブルにレコードを追加する"""
    db.add(db_image)
    db.commit()
    return db_image


def read_image(db: Session, image_id: int) -> Image:
    """images テーブルの指定された id のレコードを取得する"""
    return db.query(Image).filter(Image.id == image_id).first()  # type: ignore
