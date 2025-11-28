import os
import sys
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mark integration tests that require a running server
def pytest_configure(config):
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test requiring a running server"
    )

# Skip integration tests by default (they require server running)
def pytest_collection_modifyitems(config, items):
    for item in items:
        if "test_file_management" in item.nodeid or "test_token" in item.nodeid:
            item.add_marker(pytest.mark.skip(reason="Requires running server on localhost:8000"))
