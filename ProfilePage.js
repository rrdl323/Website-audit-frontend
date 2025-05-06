import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scheduledAudits, setScheduledAudits] = useState([]); // Placeholder for scheduled audits
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      // Fetch scheduled audits for the user
      // fetchScheduledAudits(); 
    }
  }, [user]);

  // Placeholder function to fetch scheduled audits
  // const fetchScheduledAudits = async () => { ... };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.put('/users/profile', { name, email }); 
      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder function to handle scheduling changes
  // const handleScheduleUpdate = (auditId, newSchedule) => { ... };
  // const handleCancelSchedule = (auditId) => { ... };

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: '600px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">User Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group id="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // readOnly // Consider if email should be changeable
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Form>

          <hr />
          <h4 className="text-center my-4">Subscription</h4>
          {/* Placeholder for subscription details */} 
          <p>Current Plan: <Badge bg="info">{user.subscription?.plan || 'Free Trial'}</Badge></p>
          {/* Add link to manage subscription or view billing */} 
          {/* <Button variant="outline-secondary" size="sm">Manage Subscription</Button> */} 

          <hr />
          <h4 className="text-center my-4">Scheduled Audits</h4>
          {loadingScheduled ? (
             <div className="text-center"><Spinner animation="border" size="sm" /></div>
          ) : scheduledAudits.length > 0 ? (
            <ListGroup variant="flush">
              {/* Map through scheduled audits */} 
              {/* Example item: */}
              {/* 
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>URL:</strong> {scheduledAudit.url} <br />
                  <small>Frequency: {scheduledAudit.frequency}</small>
                </div>
                <div>
                  <Button variant="outline-secondary" size="sm" className="me-2">Edit</Button>
                  <Button variant="outline-danger" size="sm">Cancel</Button>
                </div>
              </ListGroup.Item>
              */}
              <ListGroup.Item>Scheduled audit feature placeholder.</ListGroup.Item>
            </ListGroup>
          ) : (
            <p className="text-center text-muted">No audits currently scheduled.</p>
          )}
          {/* Add button to schedule new audit or manage existing ones */} 

        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;

