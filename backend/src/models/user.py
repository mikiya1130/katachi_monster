"""users テーブルの定義"""
from sqlalchemy import Column, Integer, String

from src.db import Base


class User(Base):
    """users テーブルの定義"""

    __tablename__ = "users"

    id: int = Column(Integer, primary_key=True, index=True)
    token: str = Column(String(128), nullable=False)
