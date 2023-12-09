"""user_monsters テーブルの CRUD 関数"""
import logging

from sqlalchemy.orm import Session

from src.cruds.monster import read_monster_ids
from src.models import UserMonster
from src.types.monster import TypeMonsterIds

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def read_user_monster_ids(
    db: Session,
    user_id: int,
) -> TypeMonsterIds:
    """user_monsters テーブルに登録されているモンスターの id をレベルごとに返す"""
    user_monster_ids = {
        int(result[0])
        for result in db.query(UserMonster.monster_id)
        .filter(UserMonster.user_id == user_id)
        .all()
    }
    level_1, level_2, level_3 = read_monster_ids(db=db)

    level_1 = [monster_id for monster_id in level_1 if monster_id in user_monster_ids]
    level_2 = [monster_id for monster_id in level_2 if monster_id in user_monster_ids]
    level_3 = [monster_id for monster_id in level_3 if monster_id in user_monster_ids]

    return level_1, level_2, level_3


def create_user_monster(db: Session, db_user_monster: UserMonster) -> UserMonster:
    """user_monsters テーブルにレコードを追加する"""
    db.add(db_user_monster)
    db.commit()
    return db_user_monster
