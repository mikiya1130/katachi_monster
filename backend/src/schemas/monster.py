"""monsters テーブルのカラムの型定義"""
from pydantic import BaseModel

from src.schemas.silhouette import Silhouette


class MonsterBase(BaseModel):
    """Base"""

    level: int
    monster_path: str


class MonsterCreate(MonsterBase):
    """Create"""


class Monster(MonsterBase):
    """Monster"""

    id: int
    silhouette: list[Silhouette]

    class Config:
        from_attributes = True
