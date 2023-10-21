"""エンドポイント `/monster`"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core import merge_silhouettes
from src.cruds import read_all_monsters, read_monster
from src.db import get_db
from src.types import OutGetAllMonster, OutGetMonster
from src.utils import encode_2d_list, png_to_base64image, pooling_2d

router = APIRouter()


@router.get("/monster")
def get_all_monster(
    db: Session = Depends(get_db),
) -> OutGetAllMonster:
    """エンドポイント `/monster`

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetAllMonster: レベルごとのモンスター画像
    """
    monsters = read_all_monsters(db=db)

    returns = OutGetAllMonster(monsters=([], [], []))
    for monster in monsters:
        try:
            monster_image, _ = merge_silhouettes(monster)
        except ValueError as e:
            raise HTTPException(status_code=500, detail="Invalid image type") from e

        # png => base64
        base64image = png_to_base64image(monster_image)

        # レベルごとに分類して returns に追加
        level = int(monster.level) - 1
        returns.monsters[level].append(
            OutGetMonster(id=monster.id, base64image=base64image),
        )

    return returns


@router.get("/monster/{monster_id}")
def get_monster(
    monster_id: int,
    db: Session = Depends(get_db),
) -> OutGetMonster:
    """エンドポイント `/monster/{monster_id}`

    Args:
        monster_id (int): 取得するモンスターの id
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetMonster: モンスター画像
    """
    monster = read_monster(db=db, monster_id=monster_id)
    if monster is None:
        raise HTTPException(status_code=500, detail="Monster not found")

    try:
        monster_image, segment = merge_silhouettes(monster)
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid image type") from e

    # png => base64
    base64image = png_to_base64image(monster_image)
    # pooling & list[list[str]] => str
    segment = pooling_2d(segment)
    encoded_segment = encode_2d_list(segment)

    return OutGetMonster(
        id=monster.id,
        base64image=base64image,
        segment=encoded_segment,
    )
