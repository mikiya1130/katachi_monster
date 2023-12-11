"""エンドポイント `/monster`"""
import itertools
from typing import TYPE_CHECKING, Literal

from fastapi import APIRouter, Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core import check_user, merge_images
from src.cruds import (
    read_monster,
    read_monster_ids,
    read_user_monster,
    read_user_monster_ids,
)
from src.db import get_db
from src.types import OutGetMonster, OutGetMonsters
from src.utils import encode_2d_list, png_to_base64image, pooling_2d

if TYPE_CHECKING:
    from src.models import Picture, Silhouette

router = APIRouter()


@router.get("/monsters")
def get_monsters(
    only_user_monsters: bool = False,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
) -> OutGetMonsters:
    """エンドポイント `/monsters`

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


@router.get("/monster/{monster_id}/{monster_type}")
def get_monster(  # noqa: C901, PLR0912
    monster_id: int,
    monster_type: Literal["fallback", "creating", "user_monster"],
    return_segment: bool = False,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
) -> OutGetMonster:
    """エンドポイント `/monster/{monster_id}/{monster_type}`

    Args:
        monster_id (int): 取得するモンスターの id
        monster_type (Literal["fallback", "creating", "user_monster"]):
            モンスターの種類
            - fallback: ユーザーがモンスターを未作成の時はデフォルトのモンスターを返す
            - creating: 作成中のモンスター
            - user_monster: ユーザーが作成したモンスター(存在しない場合はエラー)
        return_segment (bool, optional): セグメント情報を返すか. Defaults to False.
        db (Session, optional): DB.
        user_token (str|None, optional): Cookie.

    Returns:
        OutGetMonster:
    """
    user_id = check_user(db, user_token)

    user_monster_ids = list(
        itertools.chain.from_iterable(read_user_monster_ids(db=db, user_id=user_id)),
    )

    # DB からモンスターのレコードを取得
    db_monster = read_monster(db=db, monster_id=monster_id)
    if monster_id in user_monster_ids:
        db_user_monster = read_user_monster(
            db=db,
            user_id=user_id,
            monster_id=monster_id,
        )
        silhouette_id_to_picture = {
            picture.silhouette_id: picture for picture in db_user_monster.picture
        }
    else:
        db_user_monster = None
        silhouette_id_to_picture = {}
    # silhouette と picture のペアのリストを作成
    silhouette_list: list[tuple[Silhouette, Picture | None]] = []
    if monster_type in ("fallback", "user_monster"):
        for silhouette in db_monster.silhouette:
            if silhouette.id in silhouette_id_to_picture:
                silhouette_list.append(
                    (
                        silhouette,
                        silhouette_id_to_picture[silhouette.id],
                    ),
                )
            else:  # noqa: PLR5501
                if monster_type == "fallback":
                    silhouette_list.append((silhouette, None))
                else:
                    raise HTTPException(status_code=500, detail="Picture not found")
    elif monster_type == "creating":
        for silhouette in db_monster.silhouette:
            silhouette_list.append((silhouette, None))
            for picture in reversed(silhouette.picture):  # より最近の画像を優先
                if picture.user_id == user_id:
                    silhouette_list[-1] = (silhouette, picture)
                    break
    else:
        raise HTTPException(status_code=500, detail="Invalid type")

    # 画像の読み込みとマージ
    image, segment = merge_images(db_monster, silhouette_list)

    # png => base64
    base64image = png_to_base64image(image)

    if return_segment:
        # pooling & list[list[str]] => str
        segment = pooling_2d(segment)
        encoded_segment = encode_2d_list(segment)
    else:
        encoded_segment = None

    return OutGetMonster(
        id=db_monster.id,
        base64image=base64image,
        segment=encoded_segment,
        name=db_user_monster.name if db_user_monster else None,
        gu=db_user_monster.gu if db_user_monster else None,
        choki=db_user_monster.choki if db_user_monster else None,
        pa=db_user_monster.pa if db_user_monster else None,
    )
