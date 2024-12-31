import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStream } from '@fortawesome/free-solid-svg-icons';
import servicesList from '../data/services.json';

// 图标映射对象
const iconMapping = {
  'check-circle': faCheckCircle,
  'stream': faStream
};

const Services = () => {
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Services</h1>
      <Row>
        {servicesList.services.map((service) => (
          <Col key={service.id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <FontAwesomeIcon 
                    icon={iconMapping[service.icon]} 
                    size="3x" 
                    className="text-primary"
                  />
                </div>
                <Card.Title className="text-center">{service.name}</Card.Title>
                <Card.Text className="text-muted text-center flex-grow-1">
                  {service.description}
                </Card.Text>
                <Link 
                  to={`/${service.id}/versions`}
                  className="btn btn-primary w-100"
                >
                  查看服务
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