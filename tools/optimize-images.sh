#!/usr/bin/env bash
# Download and optimize images used on the site.
# Usage: bash tools/optimize-images.sh
# Requires: curl, imagemagick (convert), cwebp (optional)

set -euo pipefail
mkdir -p assets/images

# NOTE: Remote download commands removed — images should already exist locally in assets/images/
echo "Skipping remote downloads. If you need to re-download images, restore curl lines with source URLs."

# Expected local files (edit list if you use different names):
files=( 
  "assets/images/service-vet.jpg"
  "assets/images/service-training.jpg"
  "assets/images/service-nutrition.jpg"
  "assets/images/alex-parker.jpg"
  "assets/images/sara-lee.jpg"
  "assets/images/jordan-kim.jpg"
)

missing=0
for f in "${files[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Missing: $f"
    missing=1
  fi
done
if [ "$missing" -eq 1 ]; then
  echo "Some expected images are missing in assets/images/. Restore or place them before running optimization." >&2
  exit 1
fi

# Optional: generate resized variants and webp versions
for img in assets/images/*.jpg; do
  base="${img%.*}"
  echo "Generating webp for $img"
  if command -v cwebp > /dev/null; then
    cwebp -q 85 "$img" -o "${base}.webp"
  else
    echo "cwebp not found, trying ImageMagick convert for webp (may be lower quality)"
    if command -v convert > /dev/null; then
      convert "$img" -quality 85 "${base}.webp"
    else
      echo "No webp converter found; skipping webp for $img"
    fi
  fi

  # generate resized jpgs (480, 768, 1200)
  if command -v convert > /dev/null; then
    convert "$img" -resize 480 "${base}-480.jpg"
    convert "$img" -resize 768 "${base}-768.jpg"
    convert "$img" -resize 1200 "${base}-1200.jpg"
  fi
done

echo "Optimization script finished. Update your HTML to use the local files under assets/images/."
