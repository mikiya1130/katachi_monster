"""ユーティリティ関数"""
import base64
import io
from collections.abc import Callable
from dataclasses import dataclass
from typing import TypeVar

import cv2
import numpy as np
import numpy.typing as npt
from PIL import Image, ImageFilter


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


def set_alpha(image: Image, alpha: npt.NDArray[np.uint8]) -> Image:
    """Image 画像の alpha 値を上書きする

    Args:
        image (Image): Image 画像
        alpha (npt.NDArray[np.uint8]): alpha 値

    Returns:
        Image: 処理後 Image 画像
    """
    image_numpy = np.array(image)
    image_numpy[:, :, 3] = alpha
    return Image.fromarray(image_numpy)


def filtering_maximum(image: Image) -> Image:
    """alpha 値を基準に最大の連結成分以外を削除する

    Args:
        image (Image): Image 画像

    Returns:
        Image: 処理後 Image 画像
    """
    alpha = get_alpha(image)
    contours, _ = cv2.findContours(alpha, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    mask = np.zeros([alpha.shape[0], alpha.shape[1], 3], np.uint8)
    largest_contour = max(contours, key=cv2.contourArea)
    cv2.drawContours(mask, [largest_contour], -1, (1, -1, -1), -1)
    mask = mask[:, :, 0]
    return set_alpha(image, alpha * mask)


def smoothing(image: Image, size: int = 10) -> Image:
    """輪郭の平滑化処理

    Args:
        image (Image): Image 画像
        size (int, optional): カーネルサイズ. Defaults to 20.

    Returns:
        Image: 処理後 Image 画像
    """
    # オープニング
    alpha = get_alpha(image)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (size, size))
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, kernel)
    # モードフィルター
    alpha = Image.fromarray(alpha)
    alpha.filter(ImageFilter.ModeFilter(size))  # type: ignore
    return set_alpha(image, np.array(alpha))


@dataclass
class Position:  # noqa: D101
    left: int
    right: int
    top: int
    bottom: int

    def shift(self, x: int, y: int) -> None:
        """座標を平行移動させる

        Args:
            x (int): 横方向の移動量
            y (int): 縦方向の移動量
        """
        self.left += x
        self.right += x
        self.top += y
        self.bottom += y

    @property
    def width(self) -> int:  # noqa: D102
        return self.right - self.left

    @property
    def height(self) -> int:  # noqa: D102
        return self.bottom - self.top

    @property
    def center_x(self) -> int:  # noqa: D102
        return self.left + self.width // 2

    @property
    def center_y(self) -> int:  # noqa: D102
        return self.top + self.height // 2


def get_truth_size(
    image: Image,
    cond: Callable[[np.uint8], npt.NDArray[bool]] = lambda a: a > 0,  # type: ignore
) -> Position:
    """透過画像に写るオブジェクトの位置情報を取得する

    Args:
        image (Image): Image 画像
        cond (Callable[[np.uint8], npt.NDArray[bool]], optional):
            不透明判定する alpha 値の条件. Defaults to lambda a: a > 0.

    Returns:
        Position: 位置情報
    """
    alpha = get_alpha(image)
    # 不透明領域の範囲を求める
    range = np.where(cond(alpha))  # type: ignore  # noqa: A001
    top, bottom = min(range[0]), max(range[0])
    left, right = min(range[1]), max(range[1])
    return Position(left=left, right=right, top=top, bottom=bottom)


def cropping_image(
    image: Image,
    position: Position | None = None,
    cond: Callable[[np.uint8], npt.NDArray[bool]] = lambda a: a > 0,  # type: ignore
    padding_w: float = 0.0,
    padding_h: float = 0.0,
) -> Image:
    """画像の透明部分を切り取る

    Args:
        image (Image): Image 画像
        position (Position | None, optional):
            画像の不透明部分を計算する代わりに位置情報を与える. Defaults to None.
        cond (Callable[[np.uint8], npt.NDArray[bool]], optional):
            不透明判定する alpha 値の条件. Defaults to lambda a: a > 0.
        padding_w (float, optional): 左右に加えるパディング割合. Defaults to 0.0.
        padding_h (float, optional): 上下に加えるパディング割合. Defaults to 0.0.

    Returns:
        Image: 切り取り後 Image 画像
    """
    if position is None:
        position = get_truth_size(image, cond)
    padded_width, padded_height = int(position.width * padding_w), int(
        position.height * padding_h,
    )
    return image.crop(
        (
            position.left - padded_width,
            position.top - padded_height,
            position.right + 1 + padded_width,
            position.bottom + 1 + padded_height,
        ),
    )


T = TypeVar("T")


def resize_to_contain(image_1: Image, image_2: Image) -> tuple[Image.Image, float]:
    """`image_1` に内接するように `image_2` をリサイズする

    Args:
        image_1 (Image): 基準画像
        image_2 (Image): リサイズ対象画像

    Returns:
        Image: tuple[Image.Image, float]: `image_2` のリサイズ後画像、変換倍率
    """
    width_1, height_1 = image_1.size[:2]
    width_2, height_2 = image_2.size[:2]

    scale_width = width_1 / width_2
    scale_height = height_1 / height_2
    scale = min(scale_width, scale_height)
    height_2, width_2 = int(height_2 * scale), int(width_2 * scale)
    image_2 = image_2.resize((width_2, height_2), Image.NEAREST)

    image_ret = Image.new("RGBA", (width_1, height_1), (0, 0, 0, 0))
    offset_x, offset_y = (width_1 - width_2) // 2, (height_1 - height_2) // 2
    image_ret.paste(image_2, (offset_x, offset_y))

    return image_ret, scale


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


def calc_iou(image_1: npt.NDArray[np.uint8], image_2: npt.NDArray[np.uint8]) -> int:
    """2つの画像の IoU を計算する

    Args:
        image_1 (npt.NDArray[np.uint8]): 画像1
        image_2 (npt.NDArray[np.uint8]): 画像2

    Returns:
        int: IoU
    """
    if image_1.shape != image_2.shape:
        raise ValueError

    intersection = np.sum(np.logical_and(image_1, image_2))
    union = np.sum(np.logical_or(image_1, image_2))
    return int(100 * intersection / union)


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
