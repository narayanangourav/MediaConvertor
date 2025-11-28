import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from databases.database import SQLALCHEMY_DATABASE_URL, engine
from sqlalchemy import text, inspect
import pytest

@pytest.mark.skip(reason="Requires database connection")
def test_database_connection():
    print(f"Database URL: {SQLALCHEMY_DATABASE_URL}")
    print("-" * 50)

    try:
        # Try to connect
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            
            # Check tables
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"✅ Tables found: {tables}")
            
            if 'users' in tables:
                result = conn.execute(text("SELECT COUNT(*) FROM users"))
                count = result.scalar()
                print(f"✅ Users table has {count} rows")
            else:
                print("⚠️  No 'users' table found. Run the app to create it.")
            
            assert True  # Test passes if no exception
                
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\nTroubleshooting:")
        print("1. Is PostgreSQL running?")
        print("2. Did you create the 'mediaconverter' database?")
        print("3. Are the credentials correct? (postgres:postgres@localhost)")
        print("\nTo create the database, run in SQL Shell (psql):")
        print("   CREATE DATABASE mediaconverter;")
        pytest.fail(f"Database connection failed: {e}")
