import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { api } from '../utils/api';

const DebugAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch accounts from backend
    api.get('api/admin/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data))
      .catch(err => console.error('Error fetching accounts:', err));

    // Check current user
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    setCurrentUser({ email: userEmail, role: userRole });
  }, []);

  const handleLogin = (email, role) => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    setCurrentUser({ email, role });
    alert(`Logged in as ${email} (${role})`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setCurrentUser({ email: null, role: null });
    alert('Logged out');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        🔧 Debug: Available Accounts
      </Typography>

      {/* Current User Status */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Current Login Status:</Typography>
        {currentUser?.email ? (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Logged in as: <strong>{currentUser.email}</strong> ({currentUser.role})
            </Alert>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Alert severity="warning">
            ❌ Not logged in
          </Alert>
        )}
      </Paper>

      {/* Available Accounts */}
      <Typography variant="h6" sx={{ mb: 2 }}>Available Test Accounts:</Typography>
      
      {accounts.length === 0 ? (
        <Alert severity="info">Loading accounts...</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {accounts.map((account, index) => (
            <Paper key={index} sx={{ p: 3, border: account.role === 'admin' ? '2px solid #ff5722' : '1px solid #ddd' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">
                    {account.firstName} {account.lastName}
                    {account.role === 'admin' && (
                      <span style={{ 
                        marginLeft: '10px', 
                        padding: '4px 8px', 
                        backgroundColor: '#ff5722', 
                        color: 'white', 
                        borderRadius: '4px', 
                        fontSize: '0.8em' 
                      }}>
                        ADMIN
                      </span>
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email: {account.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Role: {account.role}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color={account.role === 'admin' ? 'error' : 'primary'}
                  onClick={() => handleLogin(account.email, account.role)}
                  disabled={currentUser?.email === account.email}
                >
                  {currentUser?.email === account.email ? 'Current User' : 'Login'}
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Instructions */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#fff3e0' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📋 Instructions:</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          1. <strong>Login as Admin:</strong> Click "Login" on any account with "ADMIN" badge
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          2. <strong>Go to Admin Reviews:</strong> Visit <code>/admin/reviews</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          3. <strong>Check Console:</strong> Open browser console (F12) to see debug info
        </Typography>
        <Typography variant="body2">
          4. <strong>Test Features:</strong> You should see edit/delete buttons and hide/show controls
        </Typography>
      </Paper>
    </Box>
  );
};

export default DebugAccounts;
