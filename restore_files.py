import os
import shutil

# Files/Folders to restore to root
restore_list = [
    'student_side',
    'packages',
    'scripts',
    'common',
    'server.js',
    'package.json',
    'package-lock.json',
    '.env.local',
    'start-all.sh',
    'tailwind.config.js',
    'postcss.config.js',
    'jsconfig.json',
    'render.yaml'
]

archive_dir = '_legacy_archive'

print(f"Restoring files from {archive_dir}...")

for item in restore_list:
    src = os.path.join(archive_dir, item)
    dst = item
    
    if os.path.exists(src):
        try:
            print(f"Restoring {item}...")
            shutil.move(src, dst)
        except Exception as e:
            print(f"❌ Error restoring {item}: {e}")
    else:
        print(f"⚠️ {item} not found in archive (might not have existed or name mismatch)")

print("✅ Restoration script finished.")
