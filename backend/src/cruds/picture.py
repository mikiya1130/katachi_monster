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


def read_picture(db: Session, picture_id: int, user_id: int) -> Picture:
    """pictures テーブルの指定された id のレコードを取得する"""
    db_picture = (
        db.query(Picture)
        .filter(Picture.id == picture_id, Picture.user_id == user_id)
        .order_by(desc(Picture.id))
        .first()
    )
    if db_picture is None:
        raise HTTPException(status_code=500, detail="Picture not found")
    return db_picture


def delete_tmp_pictures(db: Session, user_id: int) -> None:
    """user_monsters テーブルの一時保存された画像を削除する"""
    db.query(Picture).filter(
        Picture.user_id == user_id,
        Picture.user_monster_id == None,  # noqa: E711
        # NOTE: `is None` ではなく `== None` にする必要がある
    ).delete()
