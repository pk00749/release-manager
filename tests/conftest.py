import sys
import os
import pytest
import json
import tempfile

# 添加项目根目录到 Python 路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 模拟配置
class MockConfig:
    ENABLE_SSO = False

# 在导入 app 之前设置模拟配置
sys.modules['backend.config'] = MockConfig()

from backend.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def temp_data_dir():
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create necessary directories
        versions_dir = os.path.join(temp_dir, 'versions')
        os.makedirs(versions_dir, exist_ok=True)
        
        # Create a test app directory
        test_app_dir = os.path.join(versions_dir, 'test-app')
        os.makedirs(test_app_dir, exist_ok=True)
        
        # Create a test version file
        test_version = {
            "version": "1.0.0",
            "github_repo": "https://github.com/test/test-app/tag/1.0.0",
            "uat_status": "not_started",
            "prod_status": "not_started",
            "release_date": "",
            "test_result": "not_tested",
            "uat_cr": "",
            "jira_issue": "",
            "github_pull_request": "",
            "sonarqube_scan": "",
            "cyberflows_sast_scan": "",
            "cyberflows_cont_scan": "",
            "ice": "",
            "prod_cr": ""
        }
        
        with open(os.path.join(test_app_dir, '1.0.0.json'), 'w') as f:
            json.dump(test_version, f)
            
        yield temp_dir 