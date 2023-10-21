"""monster_image に silhouette_image を貼り付けて画像を完成させる"""
import numpy as np
from PIL import Image

from src.models import Monster
from src.utils import binalize_alpha, get_alpha


def merge_silhouettes(monster: Monster) -> tuple[Image.Image, list[list[str]]]:
    """monster_image に silhouette_image を貼り付けて画像を完成させる

    Args:
        monster (Monster): モンスターのレコード

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
