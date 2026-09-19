import cv2
import numpy as np
from itertools import combinations
import os


def compare_images(img1_path, img2_path):
    img1 = cv2.imread(img1_path)
    img2 = cv2.imread(img2_path)

    img1 = cv2.resize(img1, (300, 300))
    img2 = cv2.resize(img2, (300, 300))

    diff = cv2.absdiff(img1, img2)
    score = 100 - (np.sum(diff) / (300 * 300 * 3 * 255)) * 100

    return round(score, 2)



def find_duplicates(image_paths):
    groups = []
    used = set()

    for img1, img2 in combinations(image_paths, 2):
        # 👉 your similarity logic (keep same if already exists)
        score = compare_images(img1, img2)

        if score > 80:  # threshold
            found = False

            for group in groups:
                if img1 in group or img2 in group:
                    group.add(os.path.basename(img1))
                    group.add(os.path.basename(img2))
                    found = True
                    break

            if not found:
                groups.append(set([
                    os.path.basename(img1),
                    os.path.basename(img2)
                ]))

    # convert set → list
    return [list(group) for group in groups]