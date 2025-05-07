import React, { useState, useEffect } from 'react';
import { Button, Spinner, Container } from 'react-bootstrap';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [enableSSO, setEnableSSO] = useState(false);

  useEffect(() => {
    // 获取SSO配置
    fetch('http://localhost:5001/sso/config')
      .then(res => res.json())
      .then(data => setEnableSSO(data.enable_sso));
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    // 模拟SSO登录
    await fetch('http://localhost:5001/sso/login', { method: 'POST' });
    // 登录成功后可跳转主页
    window.location.href = '/';
  };

  if (!enableSSO) {
    return <Container className="main-container"><div>SSO未启用</div></Container>;
  }

  return (
    <Container className="main-container text-center" style={{ marginTop: '100px' }}>
      {loading ? (
        <div>
          <Spinner animation="border" role="status" />
          <div>正在加载...</div>
        </div>
      ) : (
        <Button variant="primary" onClick={handleLogin}>
          SSO Login
        </Button>
      )}
    </Container>
  );
};

export default Login; 