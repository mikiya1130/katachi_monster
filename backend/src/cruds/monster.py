"""monsters テーブルの CRUD 関数"""
from sqlalchemy.orm import Session

from src.models import Monster


def read_all_monsters(db: Session) -> list[Monster]:
    """monsters テーブルの全てのレコードを取得する"""
    return db.query(Monster).all()


def read_monster(db: Session, monster_id: int) -> Monster | None:
    """monsters テーブルの指定された id のレコードを取得する"""
    return db.query(Monster).filter(Monster.id == monster_id).first()
