import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto py-3">
      <Container>
        <p className="text-center mb-0">
          &copy; {currentYear} Website Audit Tool. All Rights Reserved.
        </p>
        {/* Add other footer links or information if needed */}
      </Container>
    </footer>
  );
};

export default Footer;

