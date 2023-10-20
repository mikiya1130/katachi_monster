"""エンドポイント `/monster`"""
from fastapi import APIRouter, Depends, HTTPException
from PIL import Image
from sqlalchemy.orm import Session

from src.cruds import read_all_monsters
from src.db import get_db
from src.types.monster import Monster, OutGetMonster
from src.utils import png_to_base64image

router = APIRouter()


@router.get("/monster")
def get_monster(
    db: Session = Depends(get_db),
) -> OutGetMonster:
    """エンドポイント `/monster`

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutGetMonster: レベルごとのモンスター画像
    """
    monsters = read_all_monsters(db=db)

    results: OutGetMonster = ([], [], [])
    for monster in monsters:
        # monster_image に silhouette_image を貼り付けて画像を完成させる
        monster_image = Image.open(monster.monster_path)
        if monster_image.mode != "RGBA":
            raise HTTPException(status_code=500, detail="Invalid image type")
        for silhouette in monster.silhouette:
            silhouette_image = Image.open(silhouette.silhouette_path)
            if silhouette_image.mode != "RGBA":
                raise HTTPException(status_code=500, detail="Invalid image type")
            monster_image = Image.alpha_composite(monster_image, silhouette_image)

        # png => base64
        base64image = png_to_base64image(monster_image)

        # レベルごとに分類して results に追加
        level = int(monster.level) - 1
        results[level].append(Monster(id=monster.id, base64image=base64image))  # type: ignore

    return results


# @router.get("/monster/{monster}")
# def get_monster_monster(monster: str):
#     pass


# @router.get("/monster/{monster}/{silhouette}")
# def get_monster_monster_silhouette(monster: str, silhouette: str):
#     pass
