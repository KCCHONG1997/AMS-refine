import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Grab token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:3002/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setAlert({ type: 'success', message: data.message });
      setTimeout(() => navigate('/account/login'), 2000); // Redirect after success
    } else {
      setAlert({ type: 'error', message: data.message });
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" mb={3}>Reset Password</Typography>
      {alert && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}
      <TextField
        type="password"
        label="New Password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit} sx={{ backgroundColor: '#002b5c' }}>
        Submit
      </Button>
    </Box>
  );
};

export default ResetPassword;
