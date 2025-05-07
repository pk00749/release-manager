# Mock user data
MOCK_USERS = {
    "test.user": {
        "username": "test.user",
        "email": "test.user@example.com",
        "display_name": "Test User",
        "roles": ["developer"],
        "department": "Engineering",
        "groups": ["developers"]
    }
}

# Mock SSO configuration
MOCK_SSO_CONFIG = {
    "enable_sso": True,
    "sso_provider": "mock",
    "client_id": "mock-client-id",
    "redirect_uri": "http://localhost:3000/auth/callback",
    "scope": "openid profile email",
    "authorization_endpoint": "http://localhost:5001/sso/authorize",
    "token_endpoint": "http://localhost:5001/sso/token",
    "userinfo_endpoint": "http://localhost:5001/sso/userinfo"
} 