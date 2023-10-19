"""DB設定ファイル"""
import logging
import os
import time
from collections.abc import Generator

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
    finally:
        db.close()


def init_db() -> None:
    """初期処理"""
    from src.cruds import init_monsters

    while True:
        try:
            Base.metadata.create_all(bind=engine)
            init_monsters(db=SessionLocal())
            logger.info("success initialize database")
            break
        except OperationalError as e:
            logger.info("failed initialize database: %s", e)
            time.sleep(2)
            continue


from src.models import *  # noqa: E402, F403

init_db()
