import os
import cv2
import numpy as np
from PIL import Image

COLORS = {
    'obsidian-black': {'rgb': (28, 25, 23), 'brightness': 1.0, 'contrast': 1.0},
    'washed-espresso': {'rgb': (59, 51, 43), 'brightness': 1.15, 'contrast': 1.05},
    'mineral-slate': {'rgb': (100, 109, 116), 'brightness': 1.35, 'contrast': 1.1},
    'vintage-chalk': {'rgb': (247, 244, 238), 'brightness': 2.4, 'contrast': 1.15},
    'distressed-clay': {'rgb': (140, 103, 83), 'brightness': 1.5, 'contrast': 1.1},
    'sand-dune': {'rgb': (235, 227, 213), 'brightness': 2.2, 'contrast': 1.1},
}

os.makedirs('public/mockups/graphic', exist_ok=True)
os.makedirs('public/mockups/vintage', exist_ok=True)

def segment_foreground(img_bgr):
    # Convert to grayscale
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    # Background threshold
    _, thresh = cv2.threshold(gray, 225, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    mask_feather = cv2.GaussianBlur(mask, (5, 5), 0)
    return mask_feather

def generate_variations(src_path, output_dir, prefix, is_vintage=False):
    img = cv2.imread(src_path)
    h, w = img.shape[:2]
    mask = segment_foreground(img)
    alpha = (mask / 255.0)[:, :, np.newaxis]
    
    # Normalize base image to grayscale lighting map
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    
    for color_id, col in COLORS.items():
        cr, cg, cb = col['rgb'] # Target RGB
        target_bgr = np.array([cb, cg, cr], dtype=np.float32) / 255.0
        
        if color_id == 'obsidian-black' and not is_vintage:
            # Original black base
            colored_bgr = img.astype(np.float32)
        elif is_vintage:
            # For vintage wash, blend the stone-wash texture (gray) with target color
            # Luminance preservation
            norm_gray = (gray - gray.min()) / (gray.max() - gray.min() + 1e-5)
            # Apply tone curve
            if color_id == 'obsidian-black':
                lum = np.clip(norm_gray * 0.45, 0, 1)
                colored_bgr = np.zeros_like(img, dtype=np.float32)
                for c in range(3):
                    colored_bgr[:, :, c] = lum * 255.0 * (target_bgr[c] / 0.15 + 0.1)
            elif color_id in ['vintage-chalk', 'sand-dune']:
                lum = np.clip(norm_gray * 0.9 + 0.1, 0, 1)
                colored_bgr = np.zeros_like(img, dtype=np.float32)
                for c in range(3):
                    colored_bgr[:, :, c] = np.clip(lum * target_bgr[c] * 255.0 * 1.05, 0, 255)
            else:
                lum = np.clip(norm_gray * col['brightness'], 0, 1)
                colored_bgr = np.zeros_like(img, dtype=np.float32)
                for c in range(3):
                    colored_bgr[:, :, c] = np.clip(lum * target_bgr[c] * 255.0 * 1.8, 0, 255)
        else:
            # For graphic tees, create solid color with realistic shadows & highlights
            norm_gray = (gray - gray.min()) / (gray.max() - gray.min() + 1e-5)
            if color_id in ['vintage-chalk', 'sand-dune']:
                lum = np.clip(norm_gray * 0.85 + 0.15, 0, 1)
                colored_bgr = np.zeros_like(img, dtype=np.float32)
                for c in range(3):
                    colored_bgr[:, :, c] = np.clip(lum * target_bgr[c] * 255.0 * 1.05, 0, 255)
            elif color_id == 'obsidian-black':
                colored_bgr = img.astype(np.float32)
            else:
                lum = np.clip(norm_gray * col['brightness'], 0, 1)
                colored_bgr = np.zeros_like(img, dtype=np.float32)
                for c in range(3):
                    colored_bgr[:, :, c] = np.clip(lum * target_bgr[c] * 255.0 * 1.6, 0, 255)
        
        # Combine BGR with Alpha channel
        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[:, :, :3] = np.clip(colored_bgr, 0, 255).astype(np.uint8)
        rgba[:, :, 3] = mask
        
        # Save as PNG
        out_filename = f"{prefix}_{color_id}.png"
        out_path = os.path.join(output_dir, out_filename)
        cv2.imwrite(out_path, rgba)
        print(f"Generated: {out_path}")

print("Processing Graphic Tees...")
generate_variations('public/mockups/tshirt_graphic_front.png', 'public/mockups/graphic', 'tshirt_graphic_front', is_vintage=False)
generate_variations('public/mockups/tshirt_graphic_back.png', 'public/mockups/graphic', 'tshirt_graphic_back', is_vintage=False)

print("Processing Vintage Wash Tees...")
generate_variations('public/mockups/tshirt_vintage_wash_front.png', 'public/mockups/vintage', 'tshirt_vintage_front', is_vintage=True)
generate_variations('public/mockups/tshirt_vintage_wash_back.png', 'public/mockups/vintage', 'tshirt_vintage_back', is_vintage=True)
print("Complete!")
