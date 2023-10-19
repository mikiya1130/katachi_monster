"""エンドポイント `/monster`"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.cruds import read_all_monsters
from src.db import get_db
from src.schemas import Monster

router = APIRouter()


@router.get("/monster")
def get_monster(db: Session = Depends(get_db)) -> list[Monster]:
    """エンドポイント `/monster`

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        list[Monster]: monster 一覧
    """
    return read_all_monsters(db=db)


# @router.get("/monster/{monster}")
# def get_monster_monster(monster: str):
#     pass


# @router.get("/monster/{monster}/{silhouette}")
# def get_monster_monster_silhouette(monster: str, silhouette: str):
#     pass
