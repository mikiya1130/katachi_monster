"""users テーブルの CRUD 関数"""
import logging

from sqlalchemy.orm import Session

from src.models import User

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def read_user(db: Session, user_token: str) -> User:
    """users テーブルの指定された token のレコードを取得する"""
    return db.query(User).filter(User.token == user_token).first()  # type: ignore


def create_user(db: Session, db_user: User) -> User:
    """users テーブルにレコードを追加する"""
    db.add(db_user)
    db.commit()
    return db_user
