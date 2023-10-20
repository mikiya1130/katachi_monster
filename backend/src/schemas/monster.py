"""monsters テーブルのカラムの型定義"""
from typing import Literal

from pydantic import BaseModel

from src.schemas.silhouette import Silhouette


class MonsterBase(BaseModel):
    """Base"""

    level: Literal[1, 2, 3]
    monster_path: str


class MonsterCreate(MonsterBase):
    """Create"""


class Monster(MonsterBase):
    """Monster"""

    id: int
    silhouette: list[Silhouette]

    class Config:
        from_attributes = True
