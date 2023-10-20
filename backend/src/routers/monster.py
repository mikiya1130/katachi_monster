"""エンドポイント `/monster`"""
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src import schemas, types
from src.cruds import read_all_monsters, read_monster
from src.db import get_db
from src.utils import (
    binalize_alpha,
    encode_2d_list,
    get_alpha,
    png_to_base64image,
    pooling_2d,
)

router = APIRouter()


def _merge_silhouettes(monster: schemas.Monster) -> tuple[Image.Image, list[list[str]]]:
    """monster_image に silhouette_image を貼り付けて画像を完成させる

    Args:
        monster (schemas.Monster): モンスターのレコード

    Returns:
        tuple[Image, list[list[str]]]: モンスター画像、セグメント情報
    """
    monster_image = Image.open(monster.monster_path)
    if monster_image.mode != "RGBA":
        raise ValueError
    monster_image = binalize_alpha(monster_image)

    mosnter_alpha = get_alpha(monster_image)
    segment = np.full_like(mosnter_alpha, "", dtype=object)
    segment[mosnter_alpha == 255] = f"m{monster.id}"

    for silhouette in monster.silhouette:
        silhouette_image = Image.open(silhouette.silhouette_path)
        if silhouette_image.mode != "RGBA":
            raise ValueError
        silhouette_image = binalize_alpha(silhouette_image)
        monster_image = Image.alpha_composite(monster_image, silhouette_image)

        silhouette_alpha = get_alpha(silhouette_image)
        segment[silhouette_alpha == 255] = f"s{silhouette.id}"

    return monster_image, segment.tolist()


@router.get("/monster")
def get_monster(
    db: Session = Depends(get_db),
) -> types.monster.OutGetMonster:
    """エンドポイント `/monster`

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetMonster: レベルごとのモンスター画像
    """
    monsters = read_all_monsters(db=db)

    results: types.monster.OutGetMonster = ([], [], [])
    for monster in monsters:
        try:
            monster_image, _ = _merge_silhouettes(monster)
        except ValueError as e:
            raise HTTPException(status_code=500, detail="Invalid image type") from e

        # png => base64
        base64image = png_to_base64image(monster_image)

        # レベルごとに分類して results に追加
        level = int(monster.level) - 1
        results[level].append(types.Monster(id=monster.id, base64image=base64image))  # type: ignore

    return results


@router.get("/monster/{monster_id}")
def get_monster_monster(
    monster_id: int,
    db: Session = Depends(get_db),
) -> types.Monster:
    """エンドポイント `/monster/{monster_id}`

    Args:
        monster_id (int): 取得するモンスターの id
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        Monster: モンスター画像
    """
    monster = read_monster(db=db, monster_id=monster_id)
    try:
        monster_image, segment = _merge_silhouettes(monster)
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid image type") from e

    # png => base64
    base64image = png_to_base64image(monster_image)
    # pooling & list[list[str]] => str
    segment = pooling_2d(segment)
    encoded_segment = encode_2d_list(segment)

    return types.Monster(
        id=monster.id,
        base64image=base64image,  # type: ignore
        segment=encoded_segment,
    )


# @router.get("/monster/{monster}/{silhouette}")
# def get_monster_monster_silhouette(monster: str, silhouette: str):
#     pass
