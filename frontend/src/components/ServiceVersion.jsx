import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const ServiceVersion = () => {
  const { serviceId } = useParams();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVersions();
  }, [serviceId]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/${serviceId}/versions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // 按版本号排序（倒序）
      const sortedVersions = [...data].sort((a, b) => {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < aParts.length; i++) {
          if (aParts[i] !== bParts[i]) {
            return bParts[i] - aParts[i];  // 改为倒序
          }
        }
        return 0;
      });
      
      setVersions(sortedVersions);
      setError(null);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setError('无法连接到服务器，请确保后端服务正在运行。');
    }
  };

  return (
    <Container className="main-container">
      <h1 className="mb-4">{serviceId}</h1>
      
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
                <Card.Title>v{version}</Card.Title>
                <Link to={`/${serviceId}/${version}`} className="btn btn-primary">
                  Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ServiceVersion; 