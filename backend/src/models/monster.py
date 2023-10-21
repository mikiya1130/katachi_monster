"""monsters テーブルの定義"""
from sqlalchemy import CheckConstraint, Column, Integer, String
from sqlalchemy.orm import Mapped, relationship

from src.db import Base
from src.models.silhouette import Silhouette


class Monster(Base):
    """monsters テーブルの定義"""

    __tablename__ = "monsters"

    id: int = Column(Integer, primary_key=True, index=True)
    level: int = Column(Integer, CheckConstraint("level IN (1, 2, 3)"), nullable=False)
    monster_path: str = Column(
        String(128),
        CheckConstraint("monster_path REGEXP '^images\/silhouettes\/'"),  # noqa: W605
        unique=True,
        nullable=False,
    )

    silhouette: Mapped[list[Silhouette]] = relationship("Silhouette")
