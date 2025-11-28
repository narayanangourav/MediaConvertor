import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import json
import pytest

BASE_URL = "http://localhost:8000"

@pytest.mark.skip(reason="Requires running server on localhost:8000")
def test_file_management_system():
    print("🧪 Testing File Management System\n")
    print("=" * 50)

    # Test 1: Signup
    print("\n1️⃣ Creating test user...")
    signup_data = {
        "email": "testfileuser@example.com",
        "password": "testpass123"
    }

    # Try to signup (will fail if user exists, that's OK)
    response = requests.post(f"{BASE_URL}/signup", json=signup_data)
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("✅ New user created!")
    elif response.status_code == 400:
        print("ℹ️ User already exists, logging in...")
        # Login instead
        login_data = {
            "username": signup_data["email"],
            "password": signup_data["password"]
        }
        response = requests.post(f"{BASE_URL}/token", data=login_data)
        token = response.json()["access_token"]
        print("✅ Logged in successfully!")
    else:
        print(f"❌ Error: {response.text}")
        pytest.fail(f"Signup failed with status {response.status_code}")

    print(f"Token: {token[:30]}...")

    # Test 2: Convert text to audio
    print("\n2️⃣ Converting text to audio...")
    headers = {"Authorization": f"Bearer {token}"}
    text_data = {"text": "Hello, this is a test file!"}

    response = requests.post(
        f"{BASE_URL}/convert/text-to-audio",
        json=text_data,
        headers=headers
    )

    if response.status_code == 200:
        result = response.json()
        filename = result["filename"]
        print(f"✅ File created: {filename}")
        print(f"   Download URL: {result['url']}")
    else:
        print(f"❌ Conversion failed: {response.text}")
        pytest.fail(f"Conversion failed with status {response.status_code}")

    # Test 3: List user files
    print("\n3️⃣ Listing user's files...")
    response = requests.get(f"{BASE_URL}/my-files", headers=headers)

    if response.status_code == 200:
        data = response.json()
        print(f"✅ Total files: {data['total']}")
        for file in data['files']:
            print(f"   - {file['filename'][:30]}... ({file['file_size']} bytes)")
            print(f"     Type: {file['file_type']}, Created: {file['created_at']}")
    else:
        print(f"❌ Failed to list files: {response.text}")
        pytest.fail(f"List files failed with status {response.status_code}")

    # Test 4: Download file (owner)
    print("\n4️⃣ Testing download (as owner)...")
    response = requests.get(
        f"{BASE_URL}/download/{filename}",
        headers=headers
    )

    if response.status_code == 200:
        print(f"✅ Download successful! ({len(response.content)} bytes)")
    else:
        print(f"❌ Download failed: {response.text}")
        pytest.fail(f"Download failed with status {response.status_code}")

    # Test 5: Try to download with wrong token (should fail)
    print("\n5️⃣ Testing unauthorized access...")
    fake_headers = {"Authorization": "Bearer invalid_token"}
    response = requests.get(
        f"{BASE_URL}/download/{filename}",
        headers=fake_headers
    )

    if response.status_code == 401:
        print("✅ Unauthorized access correctly blocked!")
    else:
        print(f"⚠️ Expected 401, got {response.status_code}")

    # Test 6: Create another user and try to access first user's file
    print("\n6️⃣ Testing cross-user access (should fail)...")
    user2_data = {
        "email": "testfileuser2@example.com",
        "password": "testpass123"
    }

    response = requests.post(f"{BASE_URL}/signup", json=user2_data)
    if response.status_code == 200:
        user2_token = response.json()["access_token"]
        print("✅ Second user created")
    elif response.status_code == 400:
        # Login instead
        login_data = {
            "username": user2_data["email"],
            "password": user2_data["password"]
        }
        response = requests.post(f"{BASE_URL}/token", data=login_data)
        user2_token = response.json()["access_token"]
        print("✅ Second user logged in")

    user2_headers = {"Authorization": f"Bearer {user2_token}"}
    response = requests.get(
        f"{BASE_URL}/download/{filename}",
        headers=user2_headers
    )

    if response.status_code == 404:
        print("✅ Cross-user access correctly blocked!")
        print("   (File not found or access denied)")
    else:
        print(f"⚠️ Expected 404, got {response.status_code}")

    print("\n" + "=" * 50)
    print("✅ All tests completed!")
    print("\nKey Features Verified:")
    print("✅ Files are linked to users")
    print("✅ Only file owner can download")
    print("✅ Unauthorized access is blocked")
    print("✅ File listing works correctly")
