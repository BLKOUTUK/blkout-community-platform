#!/usr/bin/env python3
"""Package Chrome Extensions for Distribution"""

import os
import zipfile
from pathlib import Path

def create_extension_zip(source_dir, output_path, exclude_patterns=None):
    """Create a zip file from source directory, excluding specified patterns"""
    if exclude_patterns is None:
        exclude_patterns = ['.git', 'auth', '.DS_Store', '.zone.identifier', '__pycache__']

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if not any(pattern in d for pattern in exclude_patterns)]

            for file in files:
                # Skip excluded files
                if any(pattern in file for pattern in exclude_patterns):
                    continue

                file_path = Path(root) / file
                arcname = file_path.relative_to(source_dir)
                zipf.write(file_path, arcname)

    return output_path

def main():
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    print("🚀 Packaging BLKOUT Chrome Extensions...")

    # Ensure directories exist
    (project_root / 'public' / 'extensions').mkdir(parents=True, exist_ok=True)
    (project_root / 'dist' / 'extensions').mkdir(parents=True, exist_ok=True)

    # Package News Curator
    print("📰 Packaging News Curator...")
    news_source = project_root / 'chrome-extension-news'
    news_zip = project_root / 'public' / 'extensions' / 'blkout-news-curator-v1.0.2.zip'

    create_extension_zip(news_source, news_zip)

    # Copy to dist
    import shutil
    shutil.copy(news_zip, project_root / 'dist' / 'extensions' / 'blkout-news-curator-v1.0.2.zip')
    print(f"✅ News Curator packaged: {news_zip}")

    # Package Events Curator
    print("📅 Packaging Events Curator...")
    events_source = project_root / 'chrome-extension-events'
    events_zip = project_root / 'public' / 'extensions' / 'blkout-events-curator-v1.0.2.zip'

    create_extension_zip(events_source, events_zip)

    # Copy to dist
    shutil.copy(events_zip, project_root / 'dist' / 'extensions' / 'blkout-events-curator-v1.0.2.zip')
    print(f"✅ Events Curator packaged: {events_zip}")

    # Show results
    print("\n📦 Packaged extensions:")
    for ext_file in (project_root / 'public' / 'extensions').glob('*.zip'):
        size = ext_file.stat().st_size / 1024
        print(f"   {ext_file.name}: {size:.1f} KB")

    print("\n✅ Extensions ready for download from admin dashboards!")
    print("   - News: /extensions/blkout-news-curator-v1.0.2.zip")
    print("   - Events: /extensions/blkout-events-curator-v1.0.2.zip")

if __name__ == '__main__':
    main()
