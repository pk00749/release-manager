import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStream, faServer } from '@fortawesome/free-solid-svg-icons';
// import servicesList from '../data/services.json';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // 获取当前服务名称
  const getCurrentServiceName = () => {
    const serviceId = currentPath.split('/')[1];
//     const service = servicesList.services.find(s => s.id === serviceId);
//     return service ? service.name : 'Services';
  };

  // 处理服务选择
  const handleServiceSelect = (serviceId) => {
    navigate(`/${serviceId}`);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Release Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
{/*             <NavDropdown  */}
{/*               title={ */}
{/*                 <span> */}
{/*                   <FontAwesomeIcon icon={faServer} className="me-2" /> */}
{/*                   {getCurrentServiceName()} */}
{/*                 </span> */}
{/*               }  */}
{/*               id="services-dropdown" */}
{/*             > */}
{/*               {servicesList.services.map((service) => ( */}
{/*                 <NavDropdown.Item */}
{/*                   key={service.id} */}
{/*                   onClick={() => handleServiceSelect(service.id)} */}
{/*                   active={currentPath.startsWith(`/${service.id}`)} */}
{/*                 > */}
{/*                   <FontAwesomeIcon  */}
{/*                     icon={service.icon === 'check-circle' ? faCheckCircle : faStream}  */}
{/*                     className="me-2" */}
{/*                   /> */}
{/*                   {service.name} */}
{/*                 </NavDropdown.Item> */}
{/*               ))} */}
{/*             </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar; 