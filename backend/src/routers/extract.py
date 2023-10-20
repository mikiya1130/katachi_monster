"""エンドポイント `/extract`"""
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException

from src.core import Rembg
from src.types import InPostExtract, OutPostExtract
from src.utils import base64image_to_png

router = APIRouter()


@router.post("/extract")
def post_extract(requests: InPostExtract) -> OutPostExtract:
    """エンドポイント `/extract`

    - 物体抽出後の画像を `/images` ディレクトリ下に保存する
    - 保存先パスを返す
    - 実行に失敗した場合は、ステータスコード 500 を返す

    Args:
        requests (InPostExtract): 対象画像の base64image データ

    Returns:
        OutPostExtract: 保存先パス
    """
    try:
        image = base64image_to_png(bytes(requests.base64image, encoding="utf-8"))
        result = Rembg.extract(image)

        time = datetime.now(timezone(timedelta(hours=+9))).strftime("%Y%m%d-%H%M%S-%f")
        upload_path = Path("images", f"{time}.png")

        result.save(upload_path)
        return OutPostExtract(upload_path=upload_path)
    except RuntimeError:
        return HTTPException(status_code=500)  # type: ignore
