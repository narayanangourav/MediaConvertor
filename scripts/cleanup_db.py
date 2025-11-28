import os
from database import get_db
from models import User, MediaFile

print("🗑️  Cleaning up database...\n")

db = next(get_db())

try:
    # Get count before deletion
    user_count = db.query(User).count()
    file_count = db.query(MediaFile).count()
    
    print(f"Found:")
    print(f"  - {user_count} users")
    print(f"  - {file_count} files\n")
    
    if user_count == 0:
        print("✅ Database is already clean!")
    else:
        # Delete all media files first (also deletes physical files)
        print("Deleting files...")
        files = db.query(MediaFile).all()
        for file_record in files:
            # Delete physical file
            file_path = os.path.join("outputs", file_record.filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"  ✓ Deleted: {file_record.filename}")
                except Exception as e:
                    print(f"  ⚠️  Could not delete {file_record.filename}: {e}")
            
            # Delete database record
            db.delete(file_record)
        
        # Delete all users (will cascade delete any remaining file records)
        print("\nDeleting users...")
        users = db.query(User).all()
        for user in users:
            print(f"  ✓ Deleted user: {user.email}")
            db.delete(user)
        
        # Commit changes
        db.commit()
        
        print("\n✅ Database cleanup complete!")
        print(f"   - Deleted {user_count} users")
        print(f"   - Deleted {file_count} files")
        
except Exception as e:
    print(f"\n❌ Error during cleanup: {e}")
    db.rollback()
finally:
    db.close()

print("\n💡 You can now create fresh accounts!")
