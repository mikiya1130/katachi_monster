"""monsters テーブルのカラムの型定義"""
from pydantic import BaseModel


class SilhouetteBase(BaseModel):
    """Base"""

    monster_id: int
    silhouette_path: str


class SilhouetteCreate(SilhouetteBase):
    """Create"""


class Silhouette(SilhouetteBase):
    """Silhouette"""

    id: int

    class Config:
        from_attributes = True
