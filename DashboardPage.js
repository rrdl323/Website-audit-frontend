import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, Form, Alert, ListGroup, Spinner, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
  const [url, setUrl] = useState('');
  const [audits, setAudits] = useState([]);
  const [loadingAudits, setLoadingAudits] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    setLoadingAudits(true);
    setError('');
    try {
      const response = await api.get('/audits'); // Assuming GET /api/audits fetches user's audits
      setAudits(response.data.audits || []); // Adjust based on actual API response structure
    } catch (err) {
      setError('Failed to load audits. Please try again later.');
      console.error("Audit fetch error:", err);
    } finally {
      setLoadingAudits(false);
    }
  };

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitSuccess('');
    setLoadingSubmit(true);
    try {
      // Assuming POST /api/audits starts a new audit
      const response = await api.post('/audits', { url }); 
      setSubmitSuccess(`Audit started for ${url}. Audit ID: ${response.data.audit_id}`); // Adjust based on API response
      setUrl(''); // Clear input field
      fetchAudits(); // Refresh the list of audits
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start audit. Check your subscription limits or URL.');
      console.error("Audit submit error:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Header>Start New Audit</Card.Header>
        <Card.Body>
          {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
          <Form onSubmit={handleAuditSubmit}>
            <Row>
              <Col md={9}>
                <Form.Group controlId="auditUrl">
                  <Form.Label>Website URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    placeholder="https://example.com" 
                    required 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button variant="primary" type="submit" disabled={loadingSubmit} className="w-100">
                  {loadingSubmit ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Start Audit'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Your Audits</Card.Header>
        <Card.Body>
          {loadingAudits ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading audits...</span>
              </Spinner>
            </div>
          ) : audits.length > 0 ? (
            <ListGroup variant="flush">
              {audits.map((audit) => (
                <ListGroup.Item key={audit._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>URL:</strong> {audit.url} <br />
                    <small>Status: {audit.status} | Started: {new Date(audit.createdAt).toLocaleString()}</small>
                  </div>
                  <Link to={`/audit/${audit._id}`}>
                    <Button variant="outline-secondary" size="sm">View Details</Button>
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>You haven't started any audits yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardPage;

