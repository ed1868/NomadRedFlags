import React from 'react';
import { Modal, Button, Carousel } from 'react-bootstrap';

function SubscriptionModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: 'black' }}>
        <Modal.Title style={{ color: 'white' }}>Subscription Plans</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'black', color: 'white' }}>
        <Carousel>
          <Carousel.Item>
            <div className="text-center">
              <h3>Basic Plan</h3>
              <p>$5.99/month</p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ color: 'red' }}>Analyze up to 10 conversations per month (screenshots or text uploads).</li>
                <li style={{ color: 'red' }}>Basic toxicity detection with a general toxicity score.</li>
                <li style={{ color: 'red' }}>Red flag detection for common signs of emotional abuse or manipulation.</li>
                <li style={{ color: 'red' }}>Simple report with toxicity score and a list of detected red flags.</li>
                <li style={{ color: 'red' }}>Email support for inquiries and assistance.</li>
              </ul>
              <Button variant="primary" className="mt-3">Choose Basic</Button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <h3>Standard Plan</h3>
              <p>$14.99/month</p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ color: 'red' }}>Analyze unlimited conversations per month.</li>
                <li style={{ color: 'red' }}>Advanced toxicity detection with detailed breakdowns of individual message toxicity.</li>
                <li style={{ color: 'red' }}>Red flag detection for subtle emotional manipulation, gaslighting, and toxic behavior patterns.</li>
                <li style={{ color: 'red' }}>Emotional intelligence insights, providing feedback on communication tone and empathy.</li>
                <li style={{ color: 'red' }}>Customizable reports with deep analysis and actionable recommendations.</li>
                <li style={{ color: 'red' }}>Priority email support with faster response times.</li>
              </ul>
              <Button variant="primary" className="mt-3">Choose Standard</Button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <h3>Premium Plan</h3>
              <p>$29.99/month</p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ color: 'red' }}>All features from the Standard Plan.</li>
                <li style={{ color: 'red' }}>Real-time message analysis integrated with popular messaging apps (optional).</li>
                <li style={{ color: 'red' }}>Personalized psychological insights and communication improvement suggestions.</li>
                <li style={{ color: 'red' }}>Historical conversation tracking for long-term relationship analysis and trends.</li>
                <li style={{ color: 'red' }}>Private consultations with experts for personalized advice (monthly session).</li>
                <li style={{ color: 'red' }}>24/7 priority chat support for immediate assistance.</li>
              </ul>
              <Button variant="primary" className="mt-3">Choose Premium</Button>
            </div>
          </Carousel.Item>
        </Carousel>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: 'black' }}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SubscriptionModal;
