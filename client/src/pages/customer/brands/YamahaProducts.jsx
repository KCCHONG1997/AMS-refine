import React, { useState } from 'react';
import { Box, Typography, Container, Divider, Button, MenuItem, Select, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../../../styles/PageLayout.css';

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

const YamahaProducts = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [displacement, setDisplacement] = useState('');

  const handleDisplacementChange = (event) => {
    setDisplacement(event.target.value);
  };

  const displacementRanges = [
    '~ 124 cc',
    '125 ~ 349 cc',
    '350 ~ 699 cc',
    '700 ~ 1099 cc',
    '1100 cc ~'
  ];

  const renderSteps = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <React.Fragment key={step}>
            <Button
              variant={activeStep === step ? 'contained' : 'text'}
              sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                mx: 1,
                backgroundColor: activeStep === step ? '#225095' : 'transparent',
                color: activeStep === step ? 'white' : '#225095',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: activeStep === step ? '#225095' : '#e0e0e0',
                }
              }}
              onClick={() => setActiveStep(step)}
            >
              {step}
            </Button>
            {step < 6 && (
              <Divider 
                orientation="horizontal" 
                flexItem 
                sx={{ 
                  width: '40px', 
                  borderColor: '#225095',
                  alignSelf: 'center',
                  borderBottomWidth: 2
                }} 
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <div className="breadcrumb">
          <a href="/">Home</a> &nbsp;&gt;&nbsp; 
          <a href="/ourproducts">Our Products</a> &nbsp;&gt;&nbsp; 
          <span>Yamaha</span>
      </div>

      {renderSteps()}

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        p: 2,
        mb: 3
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Displacement
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Parts Category
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Year
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Model
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Country
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          View Diagram
        </Typography>
      </Box>

      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
        YAMAHA Motorcycle
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Choose the displacement of your Motorcycle
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {displacementRanges.map((range) => (
          <FormControl key={range} fullWidth sx={{ maxWidth: '400px' }}>
            <StyledSelect
              value={displacement === range ? range : ''}
              onChange={handleDisplacementChange}
              displayEmpty
              renderValue={(selected) => selected || `Displacement: ${range}`}
            >
              <MenuItem value={range}>
                Displacement: {range}
              </MenuItem>
            </StyledSelect>
          </FormControl>
        ))}
      </Box>
    </Container>
  );
};

export default YamahaProducts;