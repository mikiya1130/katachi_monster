"""ユーティリティ関数"""
import base64
import io

from PIL import Image


def png_to_base64image(png_image: Image) -> bytes:
    """Image 形式の png 画像を base64 エンコードする

    Args:
        png_image (Image): png 画像

    Returns:
        bytes: base64 画像
    """
    buffer = io.BytesIO()
    png_image.save(buffer, format="PNG")
    base64image = base64.b64encode(buffer.getvalue())
    return bytes("data:image/png;base64,", encoding="utf-8") + base64image


def base64image_to_png(base64image: bytes) -> Image:
    """base64 画像を Image 形式の png 画像にデコードする

    Args:
        base64image (bytes): base64 画像

    Returns:
        Image: png 画像
    """
    bytes_image = base64.b64decode(str(base64image).split(",")[1])
    return Image.open(io.BytesIO(bytes_image))
