import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import '../../styles/PageLayout.css';

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

const Home = () => {
  const brands = [
    { name: 'Yamaha', logo: '/Yamaha_Logo.png', size: '85%' },
    { name: 'Honda', logo: '/Honda_Logo.png', size: '65%' },
    { name: 'Bosch', logo: '/Bosch_Logo.png', size: '100%' },
  ];

  return (
    <>
      <Box sx={{ position: 'relative', height: '80vh', overflow: 'hidden' }}>
        {/* Video Background */}
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
          Your browser does not support the video tag.
        </video>

        {/* Overlay content */}
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
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Where Quality Parts Meet Outstanding Service.
          </Typography>
          <Link to="/ourproducts" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: 'red', color: 'white', fontWeight: 'bold' }}>
              SHOP NOW
            </Button>
          </Link>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" className="page-title" sx={{ mb: 2 }}>
          Welcome to AMS
        </Typography>
        <Typography variant="body1" className="body">
          Your trusted partner for quality automotive parts and accessories.
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: '#f0f0f0', p: 3, mx: 'auto', my: 4, width: '60%', borderRadius: 2 }}>
        <Typography variant="h5" className="body" sx={{ fontWeight: 'bold', mb: 1 }}>
          About Us
        </Typography>
        <Typography variant="body1" className="body">
          AMS has been serving customers with top-quality automotive parts for years.
          We pride ourselves on offering a wide range of parts for multiple brands while providing excellent customer service.
        </Typography>
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

export default Home;
