import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Row, Col, ListGroup, Badge, Dropdown, Modal } from 'react-bootstrap';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
// Placeholder for charting library if needed
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AuditPage = () => {
  const { auditId } = useParams();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportError, setExportError] = useState('');
  const [compareAudits, setCompareAudits] = useState([]); // For comparison feature
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedCompareAudit, setSelectedCompareAudit] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuditDetails();
    // Fetch other audits for the same URL for comparison, if implementing
    // fetchComparableAudits(); 
  }, [auditId]);

  const fetchAuditDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/audits/${auditId}`);
      setAudit(response.data.audit);
    } catch (err) {
      setError('Failed to load audit details. Please try again later.');
      console.error("Audit details fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder: Fetch audits for the same URL to compare against
  // const fetchComparableAudits = async () => { ... };

  const handleExport = async (format) => {
    setExportError('');
    try {
      // Trigger backend export endpoint. Assuming it returns a file or URL.
      const response = await api.get(`/audits/${auditId}/export?format=${format}`, {
        responseType: 'blob', // Important for handling file downloads
      });
      
      // Create a URL for the blob
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      
      // Suggest filename
      const contentDisposition = response.headers['content-disposition'];
      let filename = `audit-${auditId}.${format}`;
      if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
          if (filenameMatch && filenameMatch.length === 2)
              filename = filenameMatch[1];
      }
      fileLink.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(fileLink);
      fileLink.click();
      
      // Clean up
      fileLink.remove();
      window.URL.revokeObjectURL(fileURL);

    } catch (err) {
        console.error("Export error:", err);
        // Handle potential errors if the response is not a blob (e.g., JSON error message)
        if (err.response && err.response.data instanceof Blob && err.response.data.type === "application/json") {
            const reader = new FileReader();
            reader.onload = function() {
                const errorData = JSON.parse(this.result);
                setExportError(errorData.message || `Failed to export as ${format}. Check subscription permissions.`);
            }
            reader.readAsText(err.response.data);
        } else {
            setExportError(`Failed to export as ${format}. Check subscription permissions or try again.`);
        }
    }
  };

  const handleCompare = () => {
      // Placeholder: Navigate to a comparison view or show results inline
      if (selectedCompareAudit) {
          alert(`Comparing current audit (${auditId}) with ${selectedCompareAudit}... (Implementation needed)`);
          // Example: navigate(`/compare?audit1=${auditId}&audit2=${selectedCompareAudit}`);
          setShowCompareModal(false);
      } else {
          alert("Please select an audit to compare with.");
      }
  };

  // Improved rendering function (example for SEO)
  const renderSeoResults = (data) => {
    if (!data) return <p>No SEO data available.</p>;
    return (
      <ListGroup variant="flush">
        <ListGroup.Item><strong>Title Tag:</strong> {data.title || <Badge bg="warning">Missing</Badge>}</ListGroup.Item>
        <ListGroup.Item><strong>Meta Description:</strong> {data.metaDescription || <Badge bg="warning">Missing</Badge>}</ListGroup.Item>
        <ListGroup.Item><strong>H1 Headings:</strong> {data.h1Count || 0}</ListGroup.Item>
        {/* Add more detailed SEO metrics, potentially with scores or icons */}
      </ListGroup>
    );
  };

  // Add similar render functions for Performance, Accessibility, Security...
  const renderGenericResults = (data) => {
      if (!data) return <p>No data available.</p>;
      // Basic display for other sections until specific renderers are made
      return <pre>{JSON.stringify(data, null, 2)}</pre>; 
  }

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading audit details...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  if (!audit) {
    return <Container className="mt-5"><Alert variant="warning">Audit not found.</Alert></Container>;
  }

  // Determine available export formats based on user subscription (example logic)
  const availableFormats = ['html']; // Default for free?
  // if (user?.subscription?.plan === 'basic') availableFormats.push('pdf');
  // if (user?.subscription?.plan === 'professional') availableFormats.push('pdf', 'csv', 'json');
  // if (user?.subscription?.plan === 'enterprise' || user?.subscription?.plan === 'seo_package') availableFormats.push('pdf', 'csv', 'json', 'xml');
  // This logic should ideally come from user context or backend

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Audit Results for: {audit.url}</h2>
          <p><small>Status: <Badge bg={audit.status === 'completed' ? 'success' : 'warning'}>{audit.status}</Badge> | Completed: {audit.completedAt ? new Date(audit.completedAt).toLocaleString() : 'N/A'}</small></p>
        </Col>
        <Col xs="auto" className="d-flex">
          {/* Compare Button - Placeholder */} 
          {/* <Button variant="outline-info" className="me-2" onClick={() => setShowCompareModal(true)} disabled={!compareAudits.length}>Compare</Button> */} 
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-primary" id="dropdown-export" disabled={audit.status !== 'completed'}>
              Export Report
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Dynamically generate based on availableFormats */} 
              <Dropdown.Item onClick={() => handleExport('pdf')}>PDF</Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport('csv')}>CSV</Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport('json')}>JSON</Dropdown.Item>
              {/* Add other formats */} 
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      {exportError && <Alert variant="danger">{exportError}</Alert>}

      {/* Render different sections of the audit report */} 
      <Card className="mb-3">
        <Card.Header>Summary</Card.Header>
        <Card.Body>{renderGenericResults(audit.summary)}</Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Header>SEO Analysis</Card.Header>
        <Card.Body>{renderSeoResults(audit.seo_results)}</Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Header>Performance Analysis</Card.Header>
        <Card.Body>{renderGenericResults(audit.performance_results)}</Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Header>Accessibility Checks</Card.Header>
        <Card.Body>{renderGenericResults(audit.accessibility_results)}</Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Header>Security Analysis</Card.Header>
        <Card.Body>{renderGenericResults(audit.security_results)}</Card.Body>
      </Card>
      {/* Add more sections as needed */} 

      <Link to="/dashboard">
        <Button variant="secondary" className="mt-3">Back to Dashboard</Button>
      </Link>

      {/* Compare Modal - Placeholder */}
      {/* 
      <Modal show={showCompareModal} onHide={() => setShowCompareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Compare Audit Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="compareAuditSelect">
            <Form.Label>Select an audit to compare with:</Form.Label>
            <Form.Select 
              value={selectedCompareAudit}
              onChange={(e) => setSelectedCompareAudit(e.target.value)}
            >
              <option value="">Choose...</option>
              {compareAudits.map(compAudit => (
                <option key={compAudit._id} value={compAudit._id}>
                  {new Date(compAudit.createdAt).toLocaleString()} - {compAudit.status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompareModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCompare} disabled={!selectedCompareAudit}>
            Compare
          </Button>
        </Modal.Footer>
      </Modal>
      */}
    </Container>
  );
};

export default AuditPage;

