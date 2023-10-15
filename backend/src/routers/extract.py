"""エンドポイント `/extract`"""
import io
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, File, HTTPException
from PIL import Image

from src.core import Rembg
from src.schemas import OutPutExtract

router = APIRouter()


@router.put("/extract")
def put_extract(file: bytes = File(...)) -> OutPutExtract:
    """エンドポイント `/extract`

    - 物体抽出後の画像を `/images` ディレクトリ下に保存する
    - 保存先パスを返す
    - 実行に失敗した場合は、ステータスコード 500 を返す

    Args:
        file (bytes, optional): 対象画像の bytes データ. Defaults to File(...).

    Returns:
        OutPutExtract: 保存先パス
    """
    try:
        result = Rembg.extract(file)
        image = Image.open(io.BytesIO(result))

        time = datetime.now(timezone(timedelta(hours=+9))).strftime("%Y%m%d-%H%M%S-%f")
        upload_path = Path("images", f"{time}.png")

        image.save(upload_path)
        return OutPutExtract(upload_path=upload_path)
    except RuntimeError:
        return HTTPException(status_code=500)  # type: ignore
