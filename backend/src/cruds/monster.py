"""monsters テーブルの CRUD 関数"""
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import Monster
from src.types.monster import TypeMonsterIds

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def read_monster_ids(db: Session) -> TypeMonsterIds:
    """monsters テーブルに登録されているモンスターの id をレベルごとに返す"""
    level_1 = [
        int(result[0])
        for result in db.query(Monster.id).filter(Monster.level == "1").all()
    ]
    level_2 = [
        int(result[0])
        for result in db.query(Monster.id).filter(Monster.level == "2").all()
    ]
    level_3 = [
        int(result[0])
        for result in db.query(Monster.id).filter(Monster.level == "3").all()
    ]
    return level_1, level_2, level_3


def read_monster(db: Session, monster_id: int) -> Monster:
    """monsters テーブルの指定された id のレコードを取得する"""
    db_monster = db.query(Monster).filter(Monster.id == monster_id).first()
    if db_monster is None:
        raise HTTPException(status_code=500, detail="Monster not found")
    return db_monster
