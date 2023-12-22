"""エンドポイント `/user`"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.cruds import create_sample_monster, create_user
from src.db import get_db
from src.models import User
from src.types import OutPostUser

router = APIRouter()


@router.post("/user")
def post_user(db: Session = Depends(get_db)) -> OutPostUser:
    """エンドポイント `/user`

    新規ユーザー作成

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Returns:
        OutPostUser: ユーザー token
    """
    db_user = User(token=str(uuid.uuid4()))
    db_user = create_user(db=db, db_user=db_user)
    # 初期サンプルモンスターを登録
    create_sample_monster(
        db=db,
        user_id=db_user.id,
        monster_id=1,
        name="Monster",
    )
    return OutPostUser(user_token=db_user.token)
