import pytest
import json
import os

def test_index_route(client):
    """Test the main index route"""
    response = client.get('/')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_app_page_existing(client, temp_data_dir):
    """Test accessing an existing app page"""
    response = client.get('/compliance-check')
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert '1.0.0' in response.json

def test_app_page_nonexistent(client):
    """Test accessing a non-existent app page"""
    response = client.get('/nonexistent-app')
    assert response.status_code == 404
    assert response.json['error'] == 'App not found'

def test_tag_page_get_existing(client, temp_data_dir):
    """Test getting an existing tag page"""
    response = client.get('/compliance-check/1.0.0')
    assert response.status_code == 200
    data = response.json
    assert data['version'] == '1.0.0'
    assert data['uat_status'] == 'released'
    assert data['prod_status'] == 'in_progress'

def test_tag_page_get_nonexistent(client):
    """Test getting a non-existent tag page"""
    response = client.get('/test-app/2.0.0')
    assert response.status_code == 200
    data = response.json
    assert data['version'] == '2.0.0'
    assert data['uat_status'] == 'not_started'

def test_tag_page_post(client, temp_data_dir):
    """Test updating a tag page"""
    update_data = {
        "version": "1.0.0",
        "uat_status": "in_progress",
        "prod_status": "not_started",
        "release_date": "2024-03-20",
        "test_result": "passed"
    }
    response = client.post('/test-app/1.0.0', json=update_data)
    assert response.status_code == 200
    assert response.json['message'] == 'Tag info saved successfully'

def test_create_uat_cr(client):
    """Test creating a UAT CR"""
    response = client.post('/test-app/1.0.0/create-uat-cr')
    assert response.status_code == 200
    assert response.json['message'] == 'UAT CR created successfully'
    assert 'cr_number' in response.json

def test_deploy_test(client):
    """Test deploying to test environment"""
    response = client.post('/test-app/1.0.0/deploy-test')
    assert response.status_code == 200
    assert response.json['message'] == 'Deployed to test environment successfully'

def test_create_prod_cr(client):
    """Test creating a production CR"""
    response = client.post('/test-app/1.0.0/create-prod-cr')
    assert response.status_code == 200
    assert response.json['message'] == 'Production CR created successfully'
    assert 'cr_number' in response.json

def test_deploy_prod(client):
    """Test deploying to production environment"""
    response = client.post('/test-app/1.0.0/deploy-prod')
    assert response.status_code == 200
    assert response.json['message'] == 'Deployed to production environment successfully' 