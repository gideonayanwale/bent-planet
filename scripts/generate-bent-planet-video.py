#!/usr/bin/env python3
"""
Bent Planet — 3D Animation Video Generator using Gemini Omni 1.1 Flash.

Generates a seamless looping 3D cosmic animation for the homepage background
using the Interactions API via the official google-genai SDK.

Prerequisites:
  - pip install -U google-genai
  - export GEMINI_API_KEY="your-api-key"

Usage:
  python scripts/generate-bent-planet-video.py
  python scripts/generate-bent-planet-video.py --resolution 1080p --duration 8
  python scripts/generate-bent-planet-video.py --extend public/videos/bent-planet-3d-loop.mp4
"""

import os
import sys
import argparse
import time
from pathlib import Path

def check_dependencies():
    """Verify google-genai SDK is installed."""
    try:
        import google.genai
        return True
    except ImportError:
        print("ERROR: google-genai SDK not found.")
        print("Install with: pip install -U google-genai")
        return False

def check_api_key():
    """Verify GEMINI_API_KEY is set."""
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_AI_API_KEY")
    if not key:
        print("ERROR: GEMINI_API_KEY environment variable is not set.")
        print("Obtain from: https://aistudio.google.com/app/apikey")
        print("Set it with:")
        print('  Windows: $env:GEMINI_API_KEY="your-key"')
        print('  Linux/Mac: export GEMINI_API_KEY="your-key"')
        return None
    return key

# ─── Prompt Engineering ───────────────────────────────────────
BENT_PLANET_PROMPT = """Continuous, unbroken single shot of a slowly rotating celestial planet viewed from deep space. The planet has a dark indigo-to-violet surface with visible atmospheric cloud bands that shimmer with bioluminescent cyan and purple light. Around the planet, a thin luminous gravitational lensing ring bends starlight in an elegant arc, glowing with soft blue-white light. 

The background is ultra-deep space: near-black void with scattered pinpoint stars that gently pulse. Tiny cosmic dust particles drift slowly across the frame. The lighting is dramatic and cinematic with a single distant star casting rim light on the planet's edge.

Camera slowly orbits the planet in a smooth, seamless loop. The motion is very slow and meditative. No scene cuts. No dialogue. No text overlays.

Sound design: Deep, low-frequency cosmic ambient drone. Subtle crystalline resonance. Very quiet. No music. No dialogue."""

EXTEND_PROMPT = """Extend this video. The scene continues with the same slow orbital camera movement around the celestial planet. The gravitational lensing ring continues to gently pulse. Stars drift slowly. Maintain the same deep space atmosphere and ambient drone. No scene cuts."""

def generate_video(
    api_key: str,
    output_path: str = "public/videos/bent-planet-3d-loop.mp4",
    resolution: str = "720p",
    aspect_ratio: str = "16:9",
    duration: int = 8,
    extend_from: str | None = None,
    timeout: int = 600,
):
    """Generate or extend the Bent Planet 3D animation video."""
    from google import genai

    client = genai.Client(api_key=api_key)

    print(f"╔══════════════════════════════════════════════════╗")
    print(f"║  Bent Planet — 3D Video Generator               ║")
    print(f"║  Model: gemini-omni-1.1-flash                   ║")
    print(f"║  Resolution: {resolution:<8} Aspect: {aspect_ratio:<10}     ║")
    print(f"║  Duration: {duration}s                                ║")
    print(f"╚══════════════════════════════════════════════════╝")
    print()

    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    if extend_from:
        # Extend an existing video
        print(f"Extending video from: {extend_from}")
        print(f"Uploading source video...")

        uploaded = client.files.upload(file=extend_from)
        print(f"Uploaded: {uploaded.name} (state: {uploaded.state})")

        # Wait for ACTIVE state
        while uploaded.state.name == "PROCESSING":
            time.sleep(2)
            uploaded = client.files.get(name=uploaded.name)
            print(f"  Processing... {uploaded.state}")

        prompt = EXTEND_PROMPT
        contents = [
            {"file_data": {"file_uri": uploaded.uri, "mime_type": uploaded.mime_type}},
            prompt,
        ]
    else:
        prompt = BENT_PLANET_PROMPT
        contents = [prompt]

    print(f"Generating video (this may take several minutes)...")
    print(f"Timeout: {timeout}s")
    start = time.time()

    try:
        interaction = client.models.generate_content(
            model="gemini-omni-1.1-flash",
            contents=contents,
            config={
                "response_modalities": ["VIDEO", "AUDIO"],
                "video_resolution": resolution,
                "aspect_ratio": aspect_ratio,
                "video_duration": duration,
            },
        )

        elapsed = time.time() - start
        print(f"Generation completed in {elapsed:.1f}s")

        # Extract and save video
        if interaction.candidates:
            for part in interaction.candidates[0].content.parts:
                if hasattr(part, "inline_data") and part.inline_data:
                    if part.inline_data.mime_type and "video" in part.inline_data.mime_type:
                        with open(output_path, "wb") as f:
                            f.write(part.inline_data.data)
                        file_size = os.path.getsize(output_path)
                        print(f"✓ Video saved: {output_path}")
                        print(f"  Size: {file_size / 1024 / 1024:.2f} MB")
                        return True

        print("WARNING: No video content in response.")
        print("This may be due to regional restrictions.")
        print("See: https://ai.google.dev/gemini-api/docs/video")
        return False

    except Exception as e:
        elapsed = time.time() - start
        print(f"ERROR after {elapsed:.1f}s: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Generate Bent Planet 3D animation video using Gemini Omni Flash"
    )
    parser.add_argument(
        "--output",
        default="public/videos/bent-planet-3d-loop.mp4",
        help="Output video path (default: public/videos/bent-planet-3d-loop.mp4)",
    )
    parser.add_argument(
        "--resolution",
        choices=["360p", "720p", "1080p", "4k"],
        default="720p",
        help="Video resolution (default: 720p)",
    )
    parser.add_argument(
        "--aspect-ratio",
        choices=["16:9", "9:16"],
        default="16:9",
        help="Aspect ratio (default: 16:9)",
    )
    parser.add_argument(
        "--duration",
        type=int,
        choices=range(3, 11),
        default=8,
        metavar="3-10",
        help="Video duration in seconds (default: 8)",
    )
    parser.add_argument(
        "--extend",
        default=None,
        help="Path to existing video to extend (up to 40s total)",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=600,
        help="HTTP request timeout in seconds (default: 600)",
    )

    args = parser.parse_args()

    if not check_dependencies():
        sys.exit(1)

    api_key = check_api_key()
    if not api_key:
        sys.exit(1)

    success = generate_video(
        api_key=api_key,
        output_path=args.output,
        resolution=args.resolution,
        aspect_ratio=args.aspect_ratio,
        duration=args.duration,
        extend_from=args.extend,
        timeout=args.timeout,
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
