import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Tabs, Tab, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';


const Login = () => {
  const [tab, setTab] = useState(0); // 0 = Sign In, 1 = Create Account
  const [form, setForm] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null); // success/error message
  const navigate = useNavigate(); // For navigation after login depending on role

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const endpoint = tab === 0 ? 'api/auth/login' : 'api/auth/register';
    console.log("📤 Sending request to:", endpoint);
    console.log("Payload:", form);

    try {
      const res = await api.post(endpoint, form);
      
      console.log("🟡 Raw response:", res);

      const data = await res.json();
      console.log("✅ Parsed response:", data);

      setAlert({ type: res.ok ? 'success' : 'error', message: data.message });

      if (res.ok && tab === 0) {
        // Save user info to localStorage
        localStorage.setItem('userEmail', data.user?.email || data.email);
        localStorage.setItem('userRole', data.user?.role || data.role);
        if ((data.user?.role || data.role) === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/');
        }
      }

    } catch (error) {
      console.error("❌ Caught error in catch block:", error);
      setAlert({ type: 'error', message: 'Server error. Try again.' });
    }
  };


  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left side with logo */}
      <Box
        sx={{
          width: '40%',
          bgcolor: '#002b5c',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src="/logo.png" alt="Logo" style={{ width: 150, marginBottom: 20 }} />
        <Typography variant="h6">Genuine Spare Parts Leader</Typography>
      </Box>

      {/* Right side with form */}
      <Box
        sx={{
          width: '60%',
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Auto Machinery
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please sign in to your account or create a new one
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 1, cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate('/account/forgot-password')}
        >
          Forgot Password?
        </Typography>


        <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 2 }}>
          <Tab label="Sign In" />
          <Tab label="Create Account" />
        </Tabs>

        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 3 }}
        >
          {tab === 0 ? 'Sign In' : 'Create Account'}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
// Note: Make sure to replace the API endpoints with your actual backend URLs
// and handle any additional logic for saving login state or redirecting after login.
// Also, ensure you have the necessary backend routes set up to handle these requests.