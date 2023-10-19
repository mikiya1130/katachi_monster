"""monsters テーブルのカラムの型定義"""
from pydantic import BaseModel


class ImageBase(BaseModel):
    """Base"""

    user_id: int
    monster_id: int
    silhouette_id: int
    image_path: str


class ImageCreate(ImageBase):
    """Create"""


class Image(ImageBase):
    """Image"""

    id: int

    class Config:
        from_attributes = True
