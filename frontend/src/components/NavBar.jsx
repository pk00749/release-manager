import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStream } from '@fortawesome/free-solid-svg-icons';
import servicesList from '../data/services.json';

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/services">Release Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {servicesList.services.map((service) => (
              <Nav.Link
                key={service.id}
                as={Link}
                to={`/${service.id}/versions`}
                active={currentPath.startsWith(`/${service.id}`)}
              >
                <FontAwesomeIcon 
                  icon={service.icon === 'check-circle' ? faCheckCircle : faStream} 
                  className="me-2"
                />
                {service.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar; 