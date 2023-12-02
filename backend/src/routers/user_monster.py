"""エンドポイント `/user_monster`"""
from fastapi import APIRouter, Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from src.cruds import create_user_monster, read_user
from src.db import get_db
from src.models import UserMonster
from src.types import InPostUserMonster, OutPostUserMonster

router = APIRouter()


@router.post("/user_monster")
def post_user_monster(
    requests: InPostUserMonster,
    db: Session = Depends(get_db),
    user_token: str | None = Cookie(None),
) -> OutPostUserMonster:
    """エンドポイント `/user_monster`

    Args:
        requests (InPostUserMonster): モンスターidと名前
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_token (str|None, optional): ユーザー token. Defaults to Cookie(None).
    """
    if user_token is None:
        raise HTTPException(status_code=500, detail="Invalid user token")
    db_user = read_user(db=db, user_token=user_token)

    # NOTE: requests.monster_id に対応するモンスターのシルエットを
    #       当該ユーザーが全て撮影済みであることをこの辺りで確認するべき

    db_user_monster = UserMonster(
        monster_id=requests.monster_id,
        user_id=db_user.id,
        name=requests.name,
    )
    db_user_monster = create_user_monster(db=db, db_user_monster=db_user_monster)
    return OutPostUserMonster(user_monster_id=db_user_monster.id)
