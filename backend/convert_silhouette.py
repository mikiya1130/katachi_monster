"""手書きのシルエット画像をアプリで扱いやすいように変換する"""
from pathlib import Path
import cv2
import numpy as np

paths = Path('images/silhouettes.original').glob('**/*.png')
out_dir = Path('images/silhouettes')

th = 128
monster_rgb = (255, 255, 255)
silhouette_rgb = (224, 255, 255)

for file in paths:
    img = cv2.imread(str(file), cv2.IMREAD_UNCHANGED)
    img = img.astype(np.uint8)

    img_alpha = img[:, :, 3]
    img_alpha = np.where(img_alpha < th, 0, 255).astype(np.uint8)

    contours, _ = cv2.findContours(img_alpha, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    img_alpha_filled = cv2.drawContours(img_alpha.copy(), contours, -1, 255, -1)

    img_out = img.copy()
    img_inner = (~img_alpha) & (img_alpha_filled)
    if file.stem == 'monster':
        img_out[:, :, 0] = img_inner * (monster_rgb[2] / 255)
        img_out[:, :, 1] = img_inner * (monster_rgb[1] / 255)
        img_out[:, :, 2] = img_inner * (monster_rgb[0] / 255)
    else:
        img_out[:, :, 0] = img_inner * (silhouette_rgb[2] / 255)
        img_out[:, :, 1] = img_inner * (silhouette_rgb[1] / 255)
        img_out[:, :, 2] = img_inner * (silhouette_rgb[0] / 255)
    img_out[: ,:, 3] = img_alpha_filled

    out_path = out_dir / file.relative_to(file.parents[1])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    print(out_path)
    cv2.imwrite(str(out_path), img_out)
