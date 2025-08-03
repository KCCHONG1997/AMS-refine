import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { api } from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await api.post('api/data/forgot-password', { email });

      let data;
      try {
        data = await res.json();
        console.log('[CLIENT] Response:', data);
      } catch (err) {
        const text = await res.text();
        console.warn('[CLIENT] Raw response:', text);
        return setAlert({ type: 'error', message: 'Server returned non-JSON response.' });
      }

      if (res.ok) {
        setSubmitted(true);
        setAlert({ type: 'success', message: data.message });
      } else {
        // 🔥 THIS is where you see the exact issue
        setAlert({ type: 'error', message: data.message || JSON.stringify(data) || 'Unknown backend error' });
      }
    } catch (err) {
      console.error('[CLIENT] Network error:', err);
      setAlert({ type: 'error', message: 'Server error. Please try again.' });
    }
  };



  return (
    <Box
      component={Paper}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" mb={3}>
        Forgot Password
      </Typography>

      {alert && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}

      {!submitted && (
        <>
          <TextField
            type="email"
            label="Enter your email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{ backgroundColor: '#002b5c' }}
          >
            Send Reset Link
          </Button>
        </>
      )}
    </Box>
  );
};

export default ForgotPassword;
