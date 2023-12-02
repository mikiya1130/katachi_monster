"""エンドポイント `/monster`"""
from fastapi import APIRouter, Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core import merge_silhouettes
from src.cruds import read_monster, read_monster_num, read_user
from src.db import get_db
from src.types import OutGetMonster, OutGetMonsterIds
from src.utils import encode_2d_list, png_to_base64image, pooling_2d

router = APIRouter()


@router.get("/monster_ids")
def get_monster_ids(
    db: Session = Depends(get_db),
) -> OutGetMonsterIds:
    """エンドポイント `/monster`

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetMonsterIds: レベルごとのモンスターIDのリスト
    """
    db_monster_ids = read_monster_num(db=db)
    return OutGetMonsterIds(monster_ids=db_monster_ids)


@router.get("/monster/{monster_id}")
def get_monster(
    monster_id: int,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
) -> OutGetMonster:
    """エンドポイント `/monster/{monster_id}`

    Args:
        monster_id (int): 取得するモンスターの id
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_token (str|None, optional): ユーザー token. Defaults to Cookie(None).

    Returns:
        OutGetMonster: モンスター画像
    """
    if user_token is None:
        raise HTTPException(status_code=500, detail="Invalid user token")
    db_user = read_user(db=db, user_token=user_token)

    db_monster = read_monster(db=db, monster_id=monster_id)
    if db_monster is None:
        raise HTTPException(status_code=500, detail="Monster not found")

    try:
        monster, segment = merge_silhouettes(db_monster, user_id=db_user.id)
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid image type") from e

    # png => base64
    base64image = png_to_base64image(monster)
    # pooling & list[list[str]] => str
    segment = pooling_2d(segment)
    encoded_segment = encode_2d_list(segment)

    return OutGetMonster(
        id=db_monster.id,
        base64image=base64image,
        segment=encoded_segment,
    )
