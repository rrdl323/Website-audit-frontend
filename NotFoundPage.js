import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="text-center mt-5">
      <Alert variant="warning">
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/">Go back to the Homepage</Link>
      </Alert>
    </Container>
  );
};

export default NotFoundPage;

