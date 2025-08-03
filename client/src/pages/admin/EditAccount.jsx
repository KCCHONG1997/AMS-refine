import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Stack,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    email: '',
    password: '',
    role: 'customer',
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3002/api/accounts/${id}`);
      const data = await res.json();
      setAccount(prev => ({
        ...prev,
        email: data.email,
        role: data.role,
        password: '', // Leave blank, don't show hashed password
      }));
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      email: account.email,
      role: account.role,
    };

    // Only include password if user entered it
    if (account.password.trim() !== '') {
      payload.password = account.password;
    }

    const res = await fetch(`http://localhost:3002/api/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate('/admin/users'); // ✅ Redirect to AccountsList page
    } else {
      alert('Update failed');
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
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" mb={3} fontWeight="bold">
        Edit User
      </Typography>

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
          helperText="Leave blank to keep the current password"
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
          onClick={handleSave}
          sx={{ px: 4, backgroundColor: '#002b5c' }}
        >
          SAVE
        </Button>
      </Stack>
    </Box>
  );
};

export default EditAccount;
