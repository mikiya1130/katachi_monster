"""ユーティリティ関数"""
import base64
import io
from typing import TypeVar

import numpy as np
import numpy.typing as npt
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
    return b"data:image/png;base64," + base64image


def base64image_to_png(base64image: bytes) -> Image:
    """base64 画像を Image 形式の png 画像にデコードする

    Args:
        base64image (bytes): base64 画像

    Returns:
        Image: png 画像
    """
    bytes_image = base64.b64decode(str(base64image).split(",")[1])
    return Image.open(io.BytesIO(bytes_image))


def binalize_alpha(
    image: Image,
    threthold: int = 128,
    low: int = 0,
    high: int = 255,
) -> Image:
    """alpha 値を2値化

    Args:
        image (Image): 元画像
        threthold (int, optional): 閾値. Defaults to 128.
        low (int, optional): 閾値未満の値の変換値. Defaults to 0.
        high (int, optional): 閾値以上の値の変換値. Defaults to 255.

    Returns:
        Image: 2値化後画像
    """
    image_numpy = np.array(image)
    image_numpy[image_numpy[:, :, 3] < threthold, 3] = low
    image_numpy[image_numpy[:, :, 3] >= threthold, 3] = high
    return Image.fromarray(image_numpy)


def get_alpha(image: Image) -> npt.NDArray[np.uint8]:
    """Image 画像の alpha 値を Numpy 配列で取得

    Args:
        image (Image): Image 画像

    Returns:
        npt.NDArray[np.uint8]: alpha 値
    """
    return np.array(image.split()[-1])


def cropping_image(image: Image) -> Image:
    """画像の透明部分を切り取る

    Args:
        image (Image): Image 画像

    Returns:
        Image: _description_
    """
    alpha = get_alpha(image)
    reduce_max_row, reduce_max_col = alpha.max(axis=0), alpha.max(axis=1)
    row_range, col_range = np.where(reduce_max_row)[0], np.where(reduce_max_col)[0]
    (left, right), (top, bottom) = row_range[[0, -1]], col_range[[0, -1]]
    return image.crop((left, top, right + 1, bottom + 1))


def padding_image(
    image: Image,
    padding_w: float = 1.5,
    padding_h: float = 3.0,
) -> Image:
    """透明のパディングを加える

    Args:
        image (Image): Image 画像
        padding_w (float, optional):
            元画像に対し左右に加えるパディング割合. Defaults to 1.5.
        padding_h (float, optional):
            元画像に対し上下に加えるパディング割合. Defaults to 3.0.

    Returns:
        Image: _description_
    """
    width, height = image.size
    padded_width, padded_height = int(width * padding_w), int(height * padding_h)
    padded_iamge = Image.new("RGBA", (padded_width, padded_height))
    padded_iamge.paste(
        image,
        ((padded_width - width) // 2, (padded_height - height) // 2),
    )
    return padded_iamge


T = TypeVar("T")


def pooling_2d(list_2d: list[list[T]], pool_size: int = 2) -> list[list[T]]:
    """2次元リストのプーリング

    - 単純に [pool_size, pool_size] ごとの領域の左上の値を採用する

    Args:
        list_2d (list[list[T]]): プーリング対象リスト
        pool_size (int, optional): プーリングサイズ. Defaults to 2.

    Returns:
        list[list[T]]: プーリング後リスト
    """
    return [
        [col for j, col in enumerate(row) if j % pool_size == 0]
        for i, row in enumerate(list_2d)
        if i % pool_size == 0
    ]


def encode_2d_list(
    list_2d: list[list[str]],
    row_sep: str = ",",
    col_sep: str = "|",
) -> str:
    """2次元リストを文字列に変換する

    Args:
        list_2d (list[list[str]]): 2次元配列
        row_sep (str, optional): 行区切り文字. Defaults to ",".
        col_sep (str, optional): 列区切り文字. Defaults to "|".

    Returns:
        str: _description_
    """
    return col_sep.join([row_sep.join(row) for row in list_2d])
