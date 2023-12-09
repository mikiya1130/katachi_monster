"""エンドポイント `/monster`"""
from fastapi import APIRouter, Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core import check_user, merge_silhouettes
from src.cruds import read_monster, read_monster_ids, read_user, read_user_monster_ids
from src.db import get_db
from src.types import OutGetMonster, OutGetMonsters
from src.utils import encode_2d_list, png_to_base64image, pooling_2d

router = APIRouter()


@router.get("/monsters")
def get_monsters(
    only_user_monsters: bool = False,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
) -> OutGetMonsters:
    """エンドポイント `/monster`

    Args:
        only_user_monsters (bool, optional):
            ユーザーが作成したモンスターのみを取得するか. Defaults to False.
        db (Session, optional): DB.
        user_token (str|None, optional): Cookie.

    Returns:
        OutGetMonsters:
            monster_ids: レベルごとのモンスターの id のリスト
    """
    user_id = check_user(db, user_token)

    if only_user_monsters:
        monster_ids = read_user_monster_ids(db=db, user_id=user_id)
    else:
        monster_ids = read_monster_ids(db=db)

    return OutGetMonsters(monster_ids=monster_ids)


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
