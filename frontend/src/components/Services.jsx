import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStream } from '@fortawesome/free-solid-svg-icons';

const services = [
  {
    id: 'compliance-check',
    name: 'Compliance Check',
    description: '合规性检查服务',
    icon: faCheckCircle
  },
  {
    id: 'airflow',
    name: 'Airflow',
    description: '工作流调度服务',
    icon: faStream
  }
];

const Services = () => {
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Services</h1>
      <Row>
        {services.map((service) => (
          <Col key={service.id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <FontAwesomeIcon 
                    icon={service.icon} 
                    size="3x" 
                    className="text-primary"
                  />
                </div>
                <Card.Title className="text-center">{service.name}</Card.Title>
                <Card.Text className="text-muted text-center flex-grow-1">
                  {service.description}
                </Card.Text>
                <Link 
                  to={`/${service.id}`} 
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