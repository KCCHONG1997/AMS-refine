import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#000', color: '#fff', p: 4, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mt: 16 }}>
      <Box>
        <img src="/logo.png" alt="Logo" style={{ width: 120, marginBottom: 16 }} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Company Information</Typography>
        <Typography><Link href="/about" color="inherit" underline="hover">About Us</Link></Typography>
        <Typography><Link href="/contact" color="inherit" underline="hover">Location</Link></Typography>
        <Typography><Link href="/contact" color="inherit" underline="hover">Contact Us</Link></Typography>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Terms & Conditions</Typography>
        <Typography><Link href="/terms" color="inherit" underline="hover">Terms & Conditions</Link></Typography>
        <Typography><Link href="/privacy" color="inherit" underline="hover">Privacy Policy</Link></Typography>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Orders</Typography>
        <Typography><Link href="/cancellations" color="inherit" underline="hover">Cancellations</Link></Typography>
        <Typography><Link href="/website-terms" color="inherit" underline="hover">Website Terms</Link></Typography>
      </Box>
    </Box>
  );
};

export default Footer;
