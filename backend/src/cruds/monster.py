"""monsters テーブルの CRUD 関数"""
import logging

from sqlalchemy.orm import Session

from src.models import Monster

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def read_monster_num(db: Session) -> tuple[list[int], list[int], list[int]]:
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


def read_monster(db: Session, monster_id: int) -> Monster | None:
    """monsters テーブルの指定された id のレコードを取得する"""
    return db.query(Monster).filter(Monster.id == monster_id).first()
