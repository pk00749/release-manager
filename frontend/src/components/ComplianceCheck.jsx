import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ComplianceCheck = () => {
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/versions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVersions(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setError('无法连接到服务器，请确保后端服务正在运行。');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Compliance Check</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        {versions.map((version) => (
          <Col key={version} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Version {version}</Card.Title>
                <Link to={`/version/${version}`} className="btn btn-primary">
                  查看详情
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ComplianceCheck; 