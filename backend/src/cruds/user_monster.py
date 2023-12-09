"""user_monsters テーブルの CRUD 関数"""
import logging

from sqlalchemy.orm import Session

from src.models import UserMonster

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def create_user_monster(db: Session, db_user_monster: UserMonster) -> UserMonster:
    """user_monsters テーブルにレコードを追加する"""
    db.add(db_user_monster)
    db.commit()
    return db_user_monster
