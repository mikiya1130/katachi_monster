"""user_monsters テーブルの定義"""
from sqlalchemy import Column, ForeignKey, Integer, String

from src.db import Base


class UserMonster(Base):
    """user_monsters テーブルの定義"""

    __tablename__ = "user_monsters"

    id: int = Column(Integer, primary_key=True, index=True)
    monster_id: int = Column(Integer, ForeignKey("monsters.id"), nullable=False)
    user_id: int = Column(Integer, ForeignKey("users.id"), nullable=False)
    name: str = Column(String(10), nullable=False)
    gu: int = Column(Integer, nullable=False)
    choki: int = Column(Integer, nullable=False)
    pa: int = Column(Integer, nullable=False)
