import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import AuthContext from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard"; // Redirect to dashboard or intended page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true }); // Redirect after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Website Audit Tool</title>
        {/* Noindex might be appropriate for login/register pages */}
        <meta name="robots" content="noindex" /> 
      </Helmet>
      <Container className="mt-5 d-flex justify-content-center">
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
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
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                {loading ? 'Logging In...' : 'Log In'}
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              Need an account? <Link to="/register">Register</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default LoginPage;

