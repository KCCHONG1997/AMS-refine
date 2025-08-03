import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
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
    cursor: 'pointer',
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

const OurProducts = () => {
    const navigate = useNavigate();

    const brands = [
        { name: 'Yamaha', logo: '/Yamaha_Logo.png', size: '85%', path: '/YamahaProducts' },
        { name: 'Honda', logo: '/Honda_Logo.png', size: '65%', path: '/HondaProducts' },
        { name: 'Bosch', logo: '/Bosch_Logo.png', size: '100%', path: '/BoschProducts' },
    ];

    const handleBrandClick = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <Box>
            {/* Breadcrumb navigation */}
            <Breadcrumb
                paths={[
                { label: 'Home', to: '/' },
                { label: 'Our Products' }
                ]}
            />

            <Typography variant="h4" component="h1" className="page-title" sx={{ mb: 2 }}>
                Brands We Carry
            </Typography>

            <BrandsContainer>
                {brands.map((brand) => (
                    <BrandCircle
                        key={brand.name}
                        onClick={() => handleBrandClick(brand.path)}
                    >
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
        </Box>
    );
};

export default OurProducts;