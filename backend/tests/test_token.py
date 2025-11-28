import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Quick Token Test Script

import requests
import pytest

@pytest.mark.skip(reason="Requires running server on localhost:8000")
def test_token_authentication():
    print("🔐 Testing Token Authentication\n")

    # Test 1: Login to get a fresh token
    print("1️⃣ Logging in to get token...")
    login_data = {
        "username": "testfileuser@example.com",
        "password": "testpass123"
    }

    response = requests.post("http://localhost:8000/token", data=login_data)

    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"✅ Got token: {token[:30]}...")
        
        # Test 2: Use token to access /my-files
        print("\n2️⃣ Testing /my-files endpoint with token...")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get("http://localhost:8000/my-files", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS! Found {data['total']} files")
            for file in data['files']:
                print(f"   - {file['filename']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
            pytest.fail(f"Failed to access /my-files: {response.status_code}")
            
        # Test 3: Try with wrong token
        print("\n3️⃣ Testing with invalid token...")
        bad_headers = {"Authorization": "Bearer invalid_token"}
        response = requests.get("http://localhost:8000/my-files", headers=bad_headers)
        
        if response.status_code == 401:
            print("✅ Correctly rejected invalid token (401)")
        else:
            print(f"⚠️ Got {response.status_code} instead of 401")
            
    else:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        pytest.fail(f"Login failed: {response.status_code}")

    print("\n" + "=" * 50)
    print("💡 SOLUTION:")
    print("If you're seeing 401 errors in the frontend:")
    print("1. Open browser DevTools (F12)")
    print("2. Go to Application tab → Local Storage")
    print("3. Find 'token' key")
    print("4. If missing or old → LOG OUT and LOG IN again")
    print("5. Try accessing /my-files again")
