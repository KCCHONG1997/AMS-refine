import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3002/api/accounts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleted(true);
        // Brief delay before redirecting
        setTimeout(() => {
          navigate('/admin/users');
        }, 1500);
      } else {
        const error = await res.json();
        alert('Failed to delete: ' + error.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error. Try again.');
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 10,
        p: 4,
        borderRadius: 3,
        textAlign: 'center',
      }}
    >
      {isDeleted ? (
        <>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            User successfully deleted
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            Redirecting to accounts list...
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Are you sure you want to delete this user?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/admin/users')}
              sx={{ px: 4 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{ px: 4 }}
            >
              Delete
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default DeleteAccount;
