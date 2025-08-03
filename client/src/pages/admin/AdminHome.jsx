import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Box,Typography,Button,IconButton,Tooltip,CircularProgress,Alert} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const BrandCircle = styled(Box)(({ theme }) => ({
  width: 220,
  height: 220,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  margin: theme.spacing(8),
  overflow: 'hidden',
  border: '0.5px solid #959595',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease',
  },
  '& img': {
    objectFit: 'contain',
  },
}));

const BrandsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: theme.spacing(7),
  marginBottom: theme.spacing(6),
}));

const EditableText = ({ children, isEditing, onClick, className, ...props }) => (
  <Box
    onClick={isEditing ? onClick : undefined}
    sx={isEditing ? {
      position: 'relative',
      border: '2px dashed',
      borderColor: 'primary.main',
      borderRadius: 1,
      p: 1,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    } : {}}
    className={className}
    {...props}
  >
    {children}
    {isEditing && (
      <EditIcon 
        sx={{ 
          position: 'absolute', 
          top: 4, 
          right: 4, 
          fontSize: 16,
          color: 'primary.main'
        }} 
      />
    )}
  </Box>
);

const AdminHome = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState({
    title: 'Where Quality Parts Meet Outstanding Service.',
    description: 'Your trusted partner for quality automotive parts and accessories.',
    featuredText: 'Welcome to AMS',
    aboutText: 'AMS has been serving customers with top-quality automotive parts for years. We pride ourselves on offering a wide range of parts for multiple brands while providing excellent customer service.'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch content from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/website-content`);
        setContent(response.data);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleEditing = async () => {
    if (isEditing) {
      try {
        await axios.put(`${API_BASE}/api/website-content`, content);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        setError("Failed to save: " + err.message);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleTextClick = (field) => {
    if (isEditing) {
      const newText = prompt('Edit text:', content[field]);
      if (newText !== null) {
        setContent(prev => ({ ...prev, [field]: newText }));
      }
    }
  };

  const brands = [
    { name: 'Yamaha', logo: '/Yamaha_Logo.png', size: '85%' },
    { name: 'Honda', logo: '/Honda_Logo.png', size: '65%' },
    { name: 'Bosch', logo: '/Bosch_Logo.png', size: '100%' },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>

      {/* Success message */}
      {saveSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 9999,
            boxShadow: 3
          }}
        >
          Changes saved successfully!
        </Alert>
      )}

      {/* Floating Edit Toggle Button */}
      <Tooltip title={isEditing ? "Save changes" : "Edit content"}>
        <IconButton
          color={isEditing ? "success" : "primary"}
          onClick={toggleEditing}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: isEditing ? 'rgba(46, 125, 50, 0.2)' : 'rgba(25, 118, 210, 0.2)',
            '&:hover': {
              backgroundColor: isEditing ? 'rgba(46, 125, 50, 0.3)' : 'rgba(25, 118, 210, 0.3)',
            }
          }}
        >
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>

      {/* Video Background Section */}
      <Box sx={{ position: 'relative', height: '80vh', overflow: 'hidden' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        <Box sx={{ 
          position: 'relative', 
          zIndex: 1, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          color: 'white',
          textAlign: 'center',
          px: 2
        }}>
          <EditableText 
            isEditing={isEditing} 
            onClick={() => handleTextClick('title')}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              {content.title}
            </Typography>
          </EditableText>
          <Link to="/ourproducts" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold' }}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Welcome Section - Now with red underline */}
      <Box sx={{ p: 4 }}>
        <EditableText 
          isEditing={isEditing} 
          onClick={() => handleTextClick('featuredText')}
          className="page-title" // This applies the red underline from your CSS
        >
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            {content.featuredText}
          </Typography>
        </EditableText>
        <EditableText 
          isEditing={isEditing} 
          onClick={() => handleTextClick('description')}
          className="body" // This applies your body text styling
        >
          <Typography variant="body1">
            {content.description}
          </Typography>
        </EditableText>
      </Box>

      {/* About Us Section */}
      <Box sx={{ backgroundColor: '#f0f0f0', p: 3, mx: 'auto', my: 4, width: '60%', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          About Us
        </Typography>
        <EditableText 
          isEditing={isEditing} 
          onClick={() => handleTextClick('aboutText')}
          className="body"
        >
          <Typography variant="body1">
            {content.aboutText}
          </Typography>
        </EditableText>
      </Box>

      {/* Brand Circles */}
      <BrandsContainer>
        {brands.map((brand) => (
          <BrandCircle key={brand.name}>
            <img
              src={brand.logo}
              alt={brand.name}
              style={{ width: brand.size, height: brand.size }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-logo.png';
              }}
            />
          </BrandCircle>
        ))}
      </BrandsContainer>
    </>
  );
};

export default AdminHome;