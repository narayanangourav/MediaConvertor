import sys
import traceback
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from databases.database import get_db
from models.models import User
from main import get_password_hash

try:
    # Test database connection
    db = next(get_db())
    print("✅ Database connection successful")
    
    # Test creating a user
    test_email = "test@example.com"
    test_password = "password123"
    
    # Check if user exists
    existing = db.query(User).filter(User.email == test_email).first()
    if existing:
        print(f"⚠️  User {test_email} already exists, deleting...")
        db.delete(existing)
        db.commit()
    
    # Create new user
    hashed = get_password_hash(test_password)
    print(f"✅ Password hashed: {hashed[:20]}...")
    
    new_user = User(email=test_email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    print(f"✅ User created successfully! ID: {new_user.id}")
    
    # Clean up
    db.delete(new_user)
    db.commit()
    print("✅ Test user deleted")
    
except Exception as e:
    print(f"❌ Error: {e}")
    traceback.print_exc()
    sys.exit(1)
