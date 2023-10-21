"""silhouettes テーブルの定義"""
from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String

from src.db import Base


class Silhouette(Base):
    """silhouettes テーブルの定義"""

    __tablename__ = "silhouettes"

    id: int = Column(Integer, primary_key=True, index=True)
    monster_id: int = Column(Integer, ForeignKey("monsters.id"), nullable=False)
    silhouette_path: str = Column(
        String(128),
        CheckConstraint(
            "silhouette_path REGEXP '^images\/silhouettes\/'",  # noqa: W605
        ),
        unique=True,
        nullable=False,
    )
