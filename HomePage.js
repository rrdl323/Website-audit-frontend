import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Import Helmet

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Website Audit Tool - Comprehensive SEO, Performance & Security Analysis</title>
        <meta name="description" content="Analyze your website's performance, SEO, accessibility, and security with our comprehensive audit tool. Get actionable insights to improve your online presence." />
        {/* Add other meta tags as needed */}
      </Helmet>
      <Container className="mt-5 text-center">
        <h1>Welcome to the Website Audit Tool</h1>
        <p className="lead">Analyze your website's performance, SEO, accessibility, and security.</p>
        
        <Row className="justify-content-center my-4">
          <Col md={8}>
            <p>
              Get comprehensive insights into your website's health. Identify issues and receive actionable recommendations to improve your online presence. Suitable for developers, marketers, and website owners.
            </p>
          </Col>
        </Row>

        <Row className="my-5">
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Comprehensive Audits</Card.Title>
                <Card.Text>
                  Check SEO, performance, accessibility, security vulnerabilities, and more.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Actionable Insights</Card.Title>
                <Card.Text>
                  Receive clear reports with prioritized recommendations for improvement.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Track Progress</Card.Title>
                <Card.Text>
                  Schedule regular audits and compare results over time to monitor improvements.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mt-4">
          <Link to="/register">
            <Button variant="primary" size="lg" className="me-2">Get Started for Free</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline-secondary" size="lg">View Pricing</Button>
          </Link>
        </div>
      </Container>
    </>
  );
};

export default HomePage;

