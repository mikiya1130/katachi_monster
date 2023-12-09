"""pictures テーブルの CRUD 関数"""
from fastapi import HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from src.models import Picture


def create_picture(db: Session, db_picture: Picture) -> Picture:
    """pictures テーブルにレコードを追加する"""
    db.add(db_picture)
    db.commit()
    return db_picture


def read_picture(db: Session, picture_id: int) -> Picture:
    """pictures テーブルの指定された id のレコードを取得する"""
    db_picture = (
        db.query(Picture)
        .filter(Picture.id == picture_id)
        .order_by(desc(Picture.id))
        .first()
    )
    if db_picture is None:
        raise HTTPException(status_code=500, detail="Picture not found")
    return db_picture
