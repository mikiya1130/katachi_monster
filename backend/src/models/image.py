"""images テーブルの定義"""
from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String

from src.db import Base


class Image(Base):
    """images テーブルの定義"""

    __tablename__ = "images"

    id: int = Column(Integer, primary_key=True, index=True)
    user_id: int = Column(Integer, ForeignKey("users.id"), nullable=False)
    silhouette_id: int = Column(Integer, ForeignKey("silhouettes.id"), nullable=False)
    image_path: str = Column(
        String(128),
        CheckConstraint("image_path REGEXP '^images\/pictures\/'"),  # noqa: W605
        unique=True,
        nullable=False,
    )
