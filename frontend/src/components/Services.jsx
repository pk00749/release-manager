import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStream } from '@fortawesome/free-solid-svg-icons';
// import servicesList from '../data/services.json';

const Services = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('http://localhost:5001', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from API');
        }
        setApps(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Failed to load apps. ${error.message}`);
        // Fallback empty array
        setApps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <Container className="main-container text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="main-container">
      <h1 className="mb-4">应用列表</h1>
      {error && (
        <Alert variant="warning" className="mb-4">
          无法从服务器获取应用列表: {error}
        </Alert>
      )}
      <Row>
        {apps.map((app) => (
          <Col key={app} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{app}</Card.Title>
                <Link 
                  to={`/${app}`}
                  className="btn btn-primary w-100"
                >
                  查看版本
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;