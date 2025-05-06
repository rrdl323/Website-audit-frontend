import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import AuthContext from '../context/AuthContext';
// Placeholder for PayPal integration
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const pricingPlans = {
  free_trial: {
    name: '14-Day Free Trial',
    price: 0,
    priceId: 'free_trial', // Placeholder ID
    features: [
      'Max 5 Pages per Audit',
      'Max 1 Website',
      'Basic SEO Analysis',
      'Basic Accessibility Checks',
      'Basic Security Analysis',
      'Basic Performance Analysis',
      'No Scheduled Audits',
      'Basic Auto-Fix Suggestions',
      'Export HTML Report',
      'Email Support'
    ]
  },
  basic: {
    name: 'Basic',
    price: 54,
    priceId: 'price_basic', // Placeholder ID for PayPal/Stripe
    features: [
      'Max 20 Pages per Audit',
      'Max 3 Websites',
      'Standard SEO Analysis',
      'Standard Accessibility Checks',
      'Standard Security Analysis',
      'Standard Performance Analysis',
      'Weekly Scheduled Audits',
      'Standard Auto-Fix Suggestions',
      'Export HTML, PDF Reports',
      'Email Support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 108,
    priceId: 'price_professional',
    features: [
      'Max 100 Pages per Audit',
      'Max 10 Websites',
      'Advanced SEO Analysis',
      'Advanced Accessibility Checks',
      'Advanced Security Analysis',
      'Advanced Performance Analysis',
      'Daily Scheduled Audits',
      'Advanced Auto-Fix Suggestions',
      'Export HTML, PDF, CSV, JSON Reports',
      'Priority Email Support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 225,
    priceId: 'price_enterprise',
    features: [
      'Unlimited Pages per Audit',
      'Unlimited Websites',
      'Comprehensive SEO Analysis',
      'Comprehensive Accessibility Checks',
      'Comprehensive Security Analysis',
      'Comprehensive Performance Analysis',
      'Hourly Scheduled Audits',
      'Comprehensive Auto-Fix Suggestions',
      'Export HTML, PDF, CSV, JSON, XML Reports',
      'Dedicated Support'
    ]
  },
  seo_package: {
    name: 'Premium SEO Package',
    price: 1000,
    priceId: 'price_seo_package',
    features: [
        'Unlimited Pages per Audit',
        '1 Website Focus',
        'Premium SEO Analysis',
        'Competitor Analysis',
        '100 Keyword Monitoring',
        'Backlink Analysis',
        'Content Strategy Guidance',
        'Weekly SEO Reports',
        'Monthly Link Building Activities',
        'Expert SEO Consultation',
        'Dedicated Support'
    ]
  }
};

const PricingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubscribe = (planId) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/pricing' } } }); // Redirect to login if not logged in
    } else {
      // Placeholder: Redirect to a checkout page or handle subscription via API
      // This is where PayPal or another payment provider integration would happen
      alert(`Subscribing to plan ID: ${planId}... (Integration needed)`);
      // Example: navigate(`/checkout?plan=${planId}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Pricing Plans - Website Audit Tool</title>
        <meta name="description" content="Choose the perfect plan for your website auditing needs. From free trials to comprehensive enterprise and SEO packages." />
        {/* Add other meta tags as needed */}
      </Helmet>
      <Container className="mt-5">
        <h1 className="text-center mb-5">Pricing Plans</h1>
        <Row>
          {Object.entries(pricingPlans).map(([key, plan]) => (
            <Col key={key} md={6} lg={4} className="mb-4 d-flex align-items-stretch">
              <Card className="w-100">
                <Card.Header as="h5" className="text-center">{plan.name}</Card.Header>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center mb-3">
                    ${plan.price}<span className="text-muted">{plan.price > 0 ? '/month' : ''}</span>
                  </Card.Title>
                  <ListGroup variant="flush" className="mb-4 flex-grow-1">
                    {plan.features.map((feature, index) => (
                      <ListGroup.Item key={index}>{feature}</ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Button 
                    variant={plan.price === 0 ? "outline-primary" : "primary"} 
                    className="w-100 mt-auto" 
                    onClick={() => handleSubscribe(plan.priceId)}
                  >
                    {plan.price === 0 ? 'Start Free Trial' : 'Subscribe'}
                  </Button>
                  {/* PayPal Button Placeholder - requires setup */}
                  {/* {plan.price > 0 && user && (
                    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                      <PayPalButtons 
                        style={{ layout: "horizontal" }}
                        createOrder={(data, actions) => {
                          // Call backend to create order
                          return fetch('/api/payments/paypal/create-order', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                            },
                            body: JSON.stringify({ planId: plan.priceId })
                          }).then(res => res.json()).then(order => order.id);
                        }}
                        onApprove={(data, actions) => {
                          // Call backend to capture order
                          return fetch('/api/payments/paypal/capture-order', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                            },
                            body: JSON.stringify({ orderId: data.orderID })
                          }).then(res => res.json()).then(details => {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            // Update user subscription status in context/UI
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  )} */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default PricingPage;

