"""monsters テーブルの CRUD 関数"""
from pathlib import Path

from sqlalchemy.orm import Session

from src import models, schemas


def init_monsters(db: Session) -> None:
    """monsters テーブルへの初期データ投入"""
    if not db.query(models.Monster).all():
        dir_list = Path("silhouettes").glob("sample_animal_*")
        for dir in dir_list:  # noqa: A001
            level = int(dir.name.split("_")[2])
            monster_path = dir / "monster.png"
            silhouette = [
                models.Silhouette(silhouette_path=str(silhouette_path))
                for silhouette_path in dir.glob("silhouette_*.png")
            ]
            monster = models.Monster(
                level=level,
                monster_path=str(monster_path),
                silhouette=silhouette,  # type: ignore
            )
            db.add(monster)
        db.commit()


def read_all_monsters(db: Session) -> list[schemas.Monster]:
    """monsters テーブルの全てのレコードを取得する"""
    return db.query(models.Monster).all()  # type: ignore


def read_monster(db: Session, monster_id: int) -> schemas.Monster:
    """monsters テーブルの指定された id のレコードを取得する"""
    return db.query(models.Monster).filter(models.Monster.id == monster_id).first()  # type: ignore
