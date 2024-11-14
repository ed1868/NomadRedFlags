import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import AboutSection from './components/AboutSection';
import SubscriptionModal from './components/SubscriptionModal';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import the custom CSS file

function App() {
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar
        variant="dark"
        expand="lg"
        className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}
        style={{ color: '#FF4136', zIndex: 1 }}
      >
        <Container>
          <Navbar.Brand href="#home" className="nav-title">RedFlags</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" className="text-light mx-2">Home</Nav.Link>
              <Nav.Link href="#features" className="text-light mx-2">Features</Nav.Link>
              <Nav.Link href="#contact" className="text-light mx-2">Contact</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <NavDropdown
                align="end"
                title={<FontAwesomeIcon icon={faUser} size="lg"  />}
                id="user-nav-dropdown"
                className="text-light"
              >
                <NavDropdown.Item href="#account">Account</NavDropdown.Item>
                <NavDropdown.Item href="#latest-messages">Latest Messages</NavDropdown.Item>
                <NavDropdown.Item href="#share">Share</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AboutSection className="about-section" />
      
        
        <FileUpload />
        {/* <Button variant="primary" onClick={handleShow} className="mt-4">
          View Subscription Plans
        </Button> */}
      
      <SubscriptionModal show={showModal} handleClose={handleClose} />
    </>
  );
}

export default App;
