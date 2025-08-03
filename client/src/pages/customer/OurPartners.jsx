import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

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

// ✅ Define OurPartners directly
const OurPartners = () => {
  const brands = [
    { name: 'Yamaha', logo: '/Yamaha_Logo.png', size: '85%' },
    { name: 'Honda', logo: '/Honda_Logo.png', size: '65%' },
    { name: 'Bosch', logo: '/Bosch_Logo.png', size: '100%' },
  ];

  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        paths={[
          { label: 'Home', to: '/' },
          { label: 'Our Partners' }
        ]}
      />

      <Typography variant="h4" component="h1" className="page-title" sx={{ mb: 2 }}>
        Our Partners
      </Typography>
      <Typography variant="body1" className="body">
        We collaborate with trusted automotive brands and distributors to bring you the best quality parts.
      </Typography>

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

      <Typography variant="body1" className="body">
        We are proud to work alongside some of the most trusted and innovative names in the auto machinery industry. These partnerships help us deliver reliable, high-performance solutions to our customers every day.
      </Typography>
    </Box>
  );
};

export default OurPartners;
