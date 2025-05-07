import pytest

def test_sso_config(client):
    """Test SSO configuration endpoint"""
    response = client.get('/sso/config')
    assert response.status_code == 200
    assert 'enable_sso' in response.json

def test_sso_login(client):
    """Test SSO login endpoint"""
    response = client.post('/sso/login')
    assert response.status_code == 200
    assert response.json['success'] is True
    assert response.json['user'] == 'sso_user'

def test_sso_login_with_session(client):
    """Test SSO login with session"""
    with client.session_transaction() as session:
        assert 'user' not in session
    
    response = client.post('/sso/login')
    assert response.status_code == 200
    
    with client.session_transaction() as session:
        assert session['user'] == 'sso_user' 