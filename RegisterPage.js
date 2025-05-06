import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import AuthContext from '../../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState(''); // Assuming name is required
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      // Adjust the payload based on your backend's requirements
      await register({ name, email, password }); 
      setSuccess('Registration successful! Please log in.');
      // Optionally redirect to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - Website Audit Tool</title>
        <meta name="robots" content="noindex" /> 
      </Helmet>
      <Container className="mt-5 d-flex justify-content-center">
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group id="password-confirm" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  required 
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default RegisterPage;

