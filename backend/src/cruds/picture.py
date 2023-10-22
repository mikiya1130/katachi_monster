"""pictures テーブルの CRUD 関数"""
from sqlalchemy.orm import Session

from src.models import Picture


def create_picture(db: Session, db_picture: Picture) -> Picture:
    """pictures テーブルにレコードを追加する"""
    db.add(db_picture)
    db.commit()
    return db_picture


def read_picture(db: Session, picture_id: int) -> Picture:
    """pictures テーブルの指定された id のレコードを取得する"""
    return db.query(Picture).filter(Picture.id == picture_id).first()  # type: ignore
