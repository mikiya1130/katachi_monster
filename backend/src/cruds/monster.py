"""monsters テーブルの CRUD 関数"""
from pathlib import Path

from sqlalchemy.orm import Session

from src.models import Monster, Silhouette


def init_monsters(db: Session) -> None:
    """monsters テーブルへの初期データ投入"""
    if not db.query(Monster).all():
        dir_list = Path("images/silhouettes").glob("sample_animal_*")
        for dir in dir_list:  # noqa: A001
            level = int(dir.name.split("_")[2])
            monster_path = dir / "monster.png"
            silhouette = [
                Silhouette(silhouette_path=str(silhouette_path))
                for silhouette_path in dir.glob("silhouette_*.png")
            ]
            monster = Monster(
                level=level,
                monster_path=str(monster_path),
                silhouette=silhouette,
            )
            db.add(monster)
        db.commit()


def read_all_monsters(db: Session) -> list[Monster]:
    """monsters テーブルの全てのレコードを取得する"""
    return db.query(Monster).all()


def read_monster(db: Session, monster_id: int) -> Monster | None:
    """monsters テーブルの指定された id のレコードを取得する"""
    return db.query(Monster).filter(Monster.id == monster_id).first()
