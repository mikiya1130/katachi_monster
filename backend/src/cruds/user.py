"""users テーブルの CRUD 関数"""
import logging

from sqlalchemy.orm import Session

from src.models import User

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def create_user(db: Session, db_user: User) -> User:
    """users テーブルにレコードを追加する"""
    db.add(db_user)
    db.commit()
    return db_user
