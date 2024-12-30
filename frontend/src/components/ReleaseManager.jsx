import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';

const ReleaseManager = () => {
  const [releases, setReleases] = useState([]);
  const [formData, setFormData] = useState({
    version: '',
    release_date: '',
    description: '',
    status: 'planned'
  });

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    const response = await fetch('http://localhost:5000/api/releases');
    const data = await response.json();
    setReleases(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/releases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    fetchReleases();
    setFormData({
      version: '',
      release_date: '',
      description: '',
      status: 'planned'
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">版本发布管理助手</h1>
      
      <Row>
        <Col md={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>版本号</Form.Label>
              <Form.Control
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({...formData, version: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>发布日期</Form.Label>
              <Form.Control
                type="date"
                value={formData.release_date}
                onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>描述</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>状态</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="planned">计划中</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              添加版本
            </Button>
          </Form>
        </Col>

        <Col md={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>版本号</th>
                <th>发布日期</th>
                <th>描述</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release) => (
                <tr key={release[0]}>
                  <td>{release[1]}</td>
                  <td>{release[2]}</td>
                  <td>{release[3]}</td>
                  <td>{release[4]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ReleaseManager; 