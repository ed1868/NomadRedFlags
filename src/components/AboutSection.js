import React from 'react';
import { Container, Button } from 'react-bootstrap';
import backgroundImage from '../assets/images/main.jpeg';

function AboutSection() {
  return (
    <div
      className="text-white text-center py-5 about-section"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1,
      }}
    >
      <div>
        <h1 className="redflags-title">RedFlags </h1> 
        <p className="redflags-subtitle">
          Don't Ignore the Red Flags. Protect yourself with intelligent conversation analysis.
        </p>
        
        <Button href="#file-upload" className="transparent-button" onClick={() => document.getElementById('file-upload').scrollIntoView({ behavior: 'smooth' })}>
          Check for Toxicity
        </Button>
        <p style={{ color: 'white', fontStyle: 'italic', fontSize: '10px', marginTop: '50px' }}>by Ai Nomads</p>
      </div>
    </div>
  );
}

export default AboutSection;
