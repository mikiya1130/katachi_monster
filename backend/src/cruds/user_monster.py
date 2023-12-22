"""user_monsters テーブルの CRUD 関数"""
import logging
import random

from fastapi import HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from src.cruds.monster import read_monster, read_monster_ids
from src.cruds.picture import delete_tmp_pictures, read_picture
from src.models import UserMonster
from src.types.monster import TypeMonsterIds

logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


def read_user_monster_ids(
    db: Session,
    user_id: int,
) -> TypeMonsterIds:
    """user_monsters テーブルに登録されているモンスターの id をレベルごとに返す"""
    user_monster_ids = {
        int(result[0])
        for result in db.query(UserMonster.monster_id)
        .filter(UserMonster.user_id == user_id)
        .all()
    }
    level_1, level_2, level_3 = read_monster_ids(db=db)

    level_1 = [monster_id for monster_id in level_1 if monster_id in user_monster_ids]
    level_2 = [monster_id for monster_id in level_2 if monster_id in user_monster_ids]
    level_3 = [monster_id for monster_id in level_3 if monster_id in user_monster_ids]

    return level_1, level_2, level_3


def read_user_monster(db: Session, user_id: int, monster_id: int) -> UserMonster:
    """user_monsters テーブルの指定された id のレコードを取得する"""
    db_user_monster = (
        db.query(UserMonster)
        .filter(UserMonster.user_id == user_id, UserMonster.monster_id == monster_id)
        .order_by(desc(UserMonster.id))
        .first()
    )
    if db_user_monster is None:
        raise HTTPException(status_code=500, detail="UserMonster not found")
    return db_user_monster


def create_user_monster(
    db: Session,
    user_id: int,
    monster_id: int,
    name: str,
) -> UserMonster:
    """user_monsters テーブルにレコードを追加する"""
    db_monster = read_monster(db=db, monster_id=monster_id)
    picture_list = []
    for silhouette in db_monster.silhouette:
        for picture in reversed(silhouette.picture):  # より最近の画像を優先
            if picture.user_id == user_id:
                picture_list.append(picture)
                break

    picture_list = list(reversed(picture_list))
    if len(picture_list) == 2:
        gu = picture_list[0].match_rate
        choki = picture_list[1].match_rate
        pa = random.randint(10, 91)  # 10 ~ 90 の間でランダムに決定
    elif len(picture_list) == 3:
        gu = picture_list[0].match_rate
        choki = picture_list[1].match_rate
        pa = picture_list[2].match_rate
    elif len(picture_list) == 4:
        gu = picture_list[0].match_rate
        choki = picture_list[1].match_rate
        pa = picture_list[2].match_rate

        gu += int((100 - gu) * picture_list[3].match_rate / 100)
        choki += int((100 - choki) * picture_list[3].match_rate / 100)
        pa += int((100 - pa) * picture_list[3].match_rate / 100)
    else:
        raise HTTPException(status_code=500, detail="Incorrect number of pictures")

    if not (0 <= gu <= 100 and 0 <= choki <= 100 and 0 <= pa <= 100):
        raise HTTPException(status_code=500, detail="Incorrect attack rate")

    # UserMonster の作成
    db_user_monster = UserMonster(
        monster_id=monster_id,
        user_id=user_id,
        name=name,
        gu=gu,
        choki=choki,
        pa=pa,
    )
    db.add(db_user_monster)
    db.flush()

    # Picture の user_monster_id を登録
    for picture in picture_list:
        db_picture = read_picture(db=db, picture_id=picture.id, user_id=user_id)
        db_picture.user_monster_id = db_user_monster.id
        db.flush()

    # 一時保存されていた Picture の削除
    delete_tmp_pictures(db=db, user_id=user_id)
    db.flush()

    db.commit()
    return db_user_monster
