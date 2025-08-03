import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

const QrCode = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold'}}>
        QR Code
      </Typography>

      <Breadcrumb
        paths={[
          { label: 'Home', to: '/' },
          { label: 'Shopping Cart', to: '/cart' },
          { label: 'Customer Info', to: '/customerinfo'},
          { label: 'Or Code'}
        ]}
        extraClass="breadcrumb-cart"
      />

      <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 2, p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mr: 4 }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#ccc', color: 'white',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              mb: 1
            }}>1</Box>
            <Typography variant="body2">Cart</Typography>
          </Box>

          <Divider sx={{ flexGrow: 1, borderBottomWidth: 2, borderColor: '#ccc' }} />

          <Box sx={{ textAlign: 'center', mx: 4 }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#ccc', color: 'white',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              mb: 1
            }}>2</Box>
            <Typography variant="body2">Customer Info</Typography>
          </Box>

          <Divider sx={{ flexGrow: 1, borderBottomWidth: 2, borderColor: '#ccc' }} />

          <Box sx={{ textAlign: 'center', ml: 4 }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: 'red', color: 'white',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              mb: 1
            }}>3</Box>
            <Typography variant="body2">Qr Code</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', color: '#888', p: 4 }}>
        <Typography variant="body1">QR Code generation will be here.</Typography>
      </Box>
    </Box>
  );
};

export default QrCode;
