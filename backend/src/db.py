"""DB設定ファイル"""
import logging
import os
import time
from collections.abc import Generator
from pathlib import Path

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

logger = logging.getLogger("uvicorn")

DATABASE_URL = f"mysql+pymysql://mysql:{os.environ['MYSQL_PASSWORD']}@database:3306/katachi_monster"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """独立したセッションを実行する"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:  # noqa: BLE001
        db.rollback()
        raise HTTPException(status_code=500, detail="DB error") from e
    finally:
        db.close()


def init_db(db: Session = get_db().__next__()) -> None:
    """初期処理"""
    from src.models import Monster, Silhouette

    def init_monsters(db: Session) -> None:
        """monsters テーブルへの初期データ投入"""
        if not db.query(Monster).all():
            dir_list = sorted(Path("images/silhouettes").glob("animal_[123]_*"))
            for dir in dir_list:  # noqa: A001
                level = int(dir.name.split("_")[1])
                monster_path = dir / "monster.png"
                db_silhouette = [
                    Silhouette(silhouette_path=str(silhouette_path))
                    for silhouette_path in dir.glob("silhouette_*.png")
                ]
                db_monster = Monster(
                    level=level,
                    monster_path=str(monster_path),
                    silhouette=db_silhouette,
                )
                db.add(db_monster)
            db.commit()

    while True:
        try:
            Base.metadata.create_all(bind=engine)
            init_monsters(db=db)
            logger.info("success initialize database")
            break
        except OperationalError as e:
            logger.info("failed initialize database: %s", e)
            time.sleep(2)
            continue


init_db()
