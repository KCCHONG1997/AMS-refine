import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Divider, TextField, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

const API_BASE = process.env.REACT_APP_API_BASE_URL;
// Removed Stripe imports
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CustomerInfo = () => {
  const navigate = useNavigate();
  // Removed Stripe hooks
  // const stripe = useStripe();
  // const elements = useElements();
  const userEmail = localStorage.getItem("userEmail");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    zipCode: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedZip = localStorage.getItem('userZipCode');
    if (savedZip) {
      setFormData(prev => ({ ...prev, zipCode: savedZip }));
    }
  }, []);

  // Removed Stripe loading check
  // if (!stripe || !elements) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
  //       <Typography>Setting up payment form...</Typography>
  //     </Box>
  //   );
  // }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Removed Stripe payment logic
  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Save order info
      await axios.post(`${API_BASE}/orders`, formData);

      localStorage.setItem('userZipCode', formData.zipCode);
      await axios.delete(`${API_BASE}/api/cart/${userEmail}`);
      navigate('/qrcode');
    } catch (err) {
      console.error('Error:', err);
      setMessage('Something went wrong during order.');
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Full-width header for breadcrumb and stepper */}
      <Box sx={{ backgroundColor: '#f5f5f5', p: 2 }}>
        <Typography variant="h5" fontWeight="bold">Checkout</Typography>
        <Breadcrumb
          paths={[
            { label: 'Home', to: '/' },
            { label: 'Shopping Cart', to: '/cart' },
            { label: 'Customer Info' }
          ]}
          extraClass="breadcrumb-cart"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          {/* Step 1 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#ccc', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>1</Box>
            <Typography variant="body2">Cart</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, height: 2, backgroundColor: '#ccc' }} />

          {/* Step 2 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: 'red', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>2</Box>
            <Typography variant="body2">Customer Info</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, height: 2, backgroundColor: '#ccc' }} />

          {/* Step 3 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#ccc', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>3</Box>
            <Typography variant="body2">Qr Code</Typography>
          </Box>
        </Box>
      </Box>

      {/* Card section starts after header */}
      <Paper sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 3 }} elevation={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Delivery Information</Typography>

        <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Postal Code" name="zipCode" value={formData.zipCode} onChange={handleChange} sx={{ mb: 3 }} inputProps={{ maxLength: 6 }} />

        {/* Removed Stripe CardElement and payment section */}
        {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Payment</Typography>
        <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
          <CardElement options={{ hidePostalCode: true }} />
        </Box> */}

        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}

        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Button variant="contained" sx={{ backgroundColor: 'red' }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerInfo;