"""ユーザーの存在を確認する"""
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.cruds import read_user


def check_user(db: Session, user_token: str | None) -> int:
    """ユーザーの存在を確認する

    Args:
        db (Session): DB.
        user_token (str|None): user token.

    Returns:
        int: user id
    """
    if user_token is None:
        raise HTTPException(status_code=500, detail="Invalid user token")

    db_user = read_user(db=db, user_token=user_token)
    if db_user is None:
        raise HTTPException(status_code=500, detail="Invalid user token")

    return db_user.id
