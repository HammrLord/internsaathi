import os
import shutil

exclude = {'.git', 'recruiter_side', '_legacy_archive', 'cleanup_files.py'}
archive_dir = '_legacy_archive'

print(f"Starting cleanup in {os.getcwd()}")

if not os.path.exists(archive_dir):
    os.makedirs(archive_dir)
    print(f"Created archive directory: {archive_dir}")

# Copy gitignore first if needed
if os.path.exists('.gitignore') and not os.path.exists('recruiter_side/.gitignore'):
    shutil.copy('.gitignore', 'recruiter_side/.gitignore')
    print("Copied .gitignore to recruiter_side")

# Move files
for item in os.listdir('.'):
    if item in exclude:
        continue
    
    # Check if inside archive already (redundant check if looping os.listdir(.))
    
    src = item
    dst = os.path.join(archive_dir, item)
    
    try:
        print(f"Moving {src}...")
        shutil.move(src, dst)
    except Exception as e:
        print(f"❌ Error moving {src}: {e}")

print("✅ Cleanup complete.")
