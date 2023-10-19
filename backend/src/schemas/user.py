"""monsters テーブルのカラムの型定義"""
from pydantic import BaseModel


class UserBase(BaseModel):
    """Base"""

    name: str


class UserCreate(UserBase):
    """Create"""


class User(UserBase):
    """User"""

    id: int

    class Config:
        from_attributes = True
