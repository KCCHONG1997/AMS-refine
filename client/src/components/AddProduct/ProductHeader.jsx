import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';

const ProductHeader = ({ progress }) => {
    return (
        <Paper elevation={0} sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #225095 0%, #1e4a87 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" component="h1" sx={{ 
                    fontWeight: 700, 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    mb: 2,
                    textAlign: 'center'
                }}>
                    Create New Product
                </Typography>
                <Typography variant="h6" sx={{ 
                    opacity: 0.9, 
                    textAlign: 'center',
                    mb: 3
                }}>
                    Add products to your catalog with detailed information and images
                </Typography>
                
                {/* Progress Bar */}
                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Progress</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>{Math.round(progress)}% Complete</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#4caf50',
                                borderRadius: 4
                            }
                        }} 
                    />
                </Box>
            </Box>
            
            {/* Decorative background elements */}
            <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                zIndex: 0
            }} />
        </Paper>
    );
};

export default ProductHeader;
