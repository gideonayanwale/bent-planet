# Bent Planet 3D Video Background — Asset Pipeline

## Video Assets Required

This directory stores the looping 3D animation video used as the homepage full-page background.

### Files

| File | Format | Purpose | Target Size |
|------|--------|---------|-------------|
| `bent-planet-3d-loop.mp4` | H.264 MP4 | Seamless looping 3D animation | < 3MB |
| `bent-planet-poster.webp` | WebP | Initial poster frame before video loads | < 50KB |

### Generating the Video with Gemini Omni Flash

The script at `scripts/generate-bent-planet-video.py` uses the `gemini-omni-1.1-flash` model to generate the 3D animation video.

**Prerequisites:**
1. Set `GEMINI_API_KEY` environment variable (obtain from [Google AI Studio](https://aistudio.google.com/app/apikey))
2. Install Python SDK: `pip install -U google-genai`
3. (Optional) Install `ffmpeg` for post-processing optimizations

**Quick generation:**
```bash
python scripts/generate-bent-planet-video.py
```

The script will generate the video and save it to `public/videos/bent-planet-3d-loop.mp4`.

### Manual Optimization Tips

If you have `ffmpeg` installed, you can further optimize the generated video:

```bash
# Re-encode with fast-start for instant web streaming (moov atom at front)
ffmpeg -i bent-planet-3d-loop.mp4 -movflags +faststart -c:v libx264 -crf 28 -preset slow -an -vf "scale=1280:720" bent-planet-3d-loop-optimized.mp4

# Extract first frame as poster
ffmpeg -i bent-planet-3d-loop.mp4 -vframes 1 -q:v 2 bent-planet-poster.webp
```

### Fallback Behavior

If the video file is missing or fails to load:
- The homepage automatically displays the **procedural cosmic canvas** (lightweight, instant-loading particle animation)
- No error is shown to the user — the experience degrades gracefully
- The ambient mode badge will show "Eco Ambient" instead of "HD Video"
