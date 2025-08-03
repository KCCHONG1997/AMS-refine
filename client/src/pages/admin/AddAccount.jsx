import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Stack,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const CreateAccount = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    email: '',
    password: '',
    role: 'customer'
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3002/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account)
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/admin/users');
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to create account' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Server error' });
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        p: 4,
        borderRadius: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" mb={3} fontWeight="bold" fontSize={35}>
        Create Account
      </Typography>

      {alert && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}

      <Stack spacing={2}>
        <TextField
          label="Email"
          name="email"
          value={account.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={account.password}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          label="Role"
          name="role"
          value={account.role}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
        </TextField>
      </Stack>

      <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate('/admin/users')}
          sx={{ px: 4 }}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ px: 4, backgroundColor: '#002b5c' }}
        >
          SAVE
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateAccount;
