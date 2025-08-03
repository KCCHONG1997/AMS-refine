import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  const fetchAccounts = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/admin/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="body">
      <h2 style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', marginLeft: '30px', fontSize: '35px' }}>
        User Accounts
      </h2>
      <Box
        component={Paper}
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 1000,
          mx: 'auto',
          borderRadius: 4,
          backgroundColor: '#fff',
        }}
      >
        <Stack spacing={2}>
          {accounts.map((account) => (
            <Box
              key={account.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                border: '1px solid #ccc',
                borderRadius: '999px',
                px: 3,
                py: 1.5,
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography>{account.email}</Typography>

              <Box>
                <IconButton onClick={() => navigate(`/admin/accounts/edit/${account.id}`)}>
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => navigate(`/admin/accounts/delete/${account.id}`)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, borderRadius: '999px' }}
          onClick={() => navigate('/admin/accounts/add')}
        >
          Create Account
        </Button>
      </Box>
    </div>
  );
};

export default AccountsList;
