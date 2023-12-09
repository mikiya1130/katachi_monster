"""monster_image と silhouette_image を貼り合わせて画像を完成させる"""
import numpy as np
from PIL import Image

from src.models import Monster, Silhouette
from src.utils import binalize_alpha, cropping_image, get_alpha, get_truth_size


def merge_images(
    db_monster: Monster,
    user_id: int,
) -> tuple[Image.Image, list[list[str]]]:
    """monster_image と silhouette_image を貼り合わせて画像を完成させる

    NOTE: silhouette_image の id の小さい順 → monster_image の順で重ねている
    NOTE: セグメント情報は、ピクセルごとに領域を以下の文字列で表した2次元配列
          撮影済み画像は、image_id ではなく元のシルエットの silhouette_id なので注意
            - 背景: ""
            - モンスター: "m{monster_id}"
            - シルエット: "s{silhouette_id}"
            - 撮影済み画像: "i{silhouette_id}"

    Args:
        db_monster (Monster): モンスターのレコード
        user_id (int): ユーザーの id

    Returns:
        tuple[Image, list[list[str]]]: モンスター画像、セグメント情報
    """
    monster = Image.open(db_monster.monster_path)
    if monster.mode != "RGBA":
        raise ValueError
    monster = binalize_alpha(monster)

    image = Image.new("RGBA", monster.size, (0, 0, 0, 0))
    segment = np.full(image.size, "", dtype=object)

    for db_silhouette in db_monster.silhouette:
        # NOTE: DB で global / local 座標を管理するのがよさそう
        if db_silhouette.picture and db_silhouette.picture[-1].user_id == user_id:
            # 撮影済み画像が存在するとき
            db_picture = db_silhouette.picture[-1]

            silhouette = Image.open(db_picture.picture_path)
            if silhouette.mode != "RGBA":
                raise ValueError
            silhouette = binalize_alpha(silhouette)

            def get_global_from_silhouette(
                db_silhouette: Silhouette,
            ) -> tuple[int, int]:
                """silhouette 画像から global 座標を計算"""
                silhouette = Image.open(db_silhouette.silhouette_path)
                if silhouette.mode != "RGBA":
                    raise ValueError
                silhouette = binalize_alpha(silhouette)

                position = get_truth_size(silhouette)
                return position.center_x, position.center_y

            position = get_truth_size(silhouette)
            global_x, global_y = get_global_from_silhouette(db_silhouette)
            local_x, local_y = (
                position.center_x - position.left,
                position.center_y - position.top,
            )

            silhouette = cropping_image(silhouette)
            segment_id = f"i{db_silhouette.id}"
        else:
            # 撮影済み画像が存在しないとき
            silhouette = Image.open(db_silhouette.silhouette_path)
            if silhouette.mode != "RGBA":
                raise ValueError
            silhouette = binalize_alpha(silhouette)

            position = get_truth_size(silhouette)
            global_x, global_y = position.center_x, position.center_y
            local_x, local_y = (
                position.center_x - position.left,
                position.center_y - position.top,
            )

            silhouette = cropping_image(silhouette)
            segment_id = f"s{db_silhouette.id}"

        padding_silhouette = Image.new("RGBA", image.size, (0, 0, 0, 0))
        offset_x, offset_y = global_x - local_x, global_y - local_y
        padding_silhouette.paste(silhouette, (offset_x, offset_y))

        image = Image.alpha_composite(image, padding_silhouette)

        silhouette_alpha = get_alpha(padding_silhouette)
        segment[silhouette_alpha == 255] = segment_id

    image = Image.alpha_composite(image, monster)

    mosnter_alpha = get_alpha(monster)
    segment[mosnter_alpha == 255] = f"m{db_monster.id}"

    return image, segment.tolist()
