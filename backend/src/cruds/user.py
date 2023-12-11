"""users テーブルの CRUD 関数"""
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import User

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def read_user(db: Session, user_token: str) -> User:
    """users テーブルの指定された token のレコードを取得する"""
    db_user = db.query(User).filter(User.token == user_token).first()
    if db_user is None:
        raise HTTPException(status_code=500, detail="User not found")
    return db_user


def create_user(db: Session, db_user: User) -> User:
    """users テーブルにレコードを追加する"""
    db.add(db_user)
    db.commit()
    return db_user
