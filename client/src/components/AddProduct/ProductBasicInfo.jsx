import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Card,
    CardContent,
    Stack,
    Chip
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';

const ProductBasicInfo = ({ title, setTitle, price, setPrice, showPriceField }) => {
    return (
        <Card elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(90deg, #fff3e0 0%, #f3e5f5 100%)',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: 1
                        }}>
                            <TitleIcon sx={{ color: '#225095', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Step 2: Basic Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enter the product title and pricing information
                            </Typography>
                        </Box>
                        {title.trim() && (
                            <Chip 
                                label="Completed" 
                                color="success" 
                                variant="outlined"
                                sx={{ ml: 'auto' }}
                            />
                        )}
                    </Stack>
                </Box>
                
                <Box sx={{ p: 4 }}>
                    <TextField
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        multiline
                        maxRows={3}
                        label="Product Title"
                        placeholder="Enter a descriptive title for your product..."
                        sx={{
                            mb: showPriceField ? 3 : 0,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: '#e0e0e0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#225095',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#225095',
                                    borderWidth: 2,
                                },
                            },
                        }}
                    />

                    {showPriceField && (
                        <TextField
                            fullWidth
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            required
                            placeholder="Enter product price..."
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1, color: '#666' }}>$</Typography>,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    '& fieldset': {
                                        borderColor: '#e0e0e0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#225095',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#225095',
                                        borderWidth: 2,
                                    },
                                },
                            }}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductBasicInfo;
