import React from 'react';
import {
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Stack,
    Chip
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductCategorySelector = ({
    productDestination,
    setProductDestination,
    productsMenuOpen,
    setProductsMenuOpen,
    displacementOptions,
    partsCategoryOptions
}) => {
    return (
        <Card elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(90deg, #e3f2fd 0%, #f3e5f5 100%)',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: 1
                        }}>
                            <CategoryIcon sx={{ color: '#225095', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Step 1: Product Category
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Choose the category that best describes your product
                            </Typography>
                        </Box>
                        {productDestination && (
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
                    <FormControl fullWidth>
                        <InputLabel id="product-destination-label">Destination</InputLabel>
                        <Select
                            labelId="product-destination-label"
                            id="product-destination"
                            value={productDestination}
                            label="Destination"
                            onChange={(e) => setProductDestination(e.target.value)}
                            renderValue={(selected) => {
                                if (selected.startsWith('Displacement') || selected.startsWith('Parts Category')) {
                                    return selected;
                                }
                                return selected;
                            }}
                            required
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e0e0e0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#225095',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#225095',
                                    borderWidth: 2,
                                },
                            }}
                        >
                            {/* Brands We Carry */}
                            <MenuItem value="Brands We Carry">Brands We Carry</MenuItem>

                            {/* Displacement dropdown */}
                            <Box
                                onMouseEnter={() => setProductsMenuOpen('displacement')}
                                onMouseLeave={() => setProductsMenuOpen(null)}
                                sx={{ position: 'relative' }}
                            >
                                <MenuItem
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        backgroundColor: productsMenuOpen === 'displacement' ? '#f5f5f5' : 'inherit'
                                    }}
                                >
                                    Displacement
                                    {productsMenuOpen === 'displacement' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </MenuItem>

                                {productsMenuOpen === 'displacement' && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            zIndex: 1,
                                            backgroundColor: '#f5f5f5',
                                            boxShadow: '0px 4px 5px -2px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseEnter={() => setProductsMenuOpen('displacement')}
                                        onMouseLeave={() => setProductsMenuOpen(null)}
                                    >
                                        {displacementOptions.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                onClick={() => {
                                                    setProductDestination(option.value);
                                                    setProductsMenuOpen(null);
                                                }}
                                                sx={{
                                                    pl: 6,
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    backgroundColor: '#f5f5f5',
                                                    '&:hover': {
                                                        backgroundColor: '#e0e0e0',
                                                    }
                                                }}
                                            >
                                                {option.display}
                                            </MenuItem>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            {/* Year */}
                            <MenuItem value="Year">Year</MenuItem>

                            {/* Model */}
                            <MenuItem value="Model">Model</MenuItem>

                            {/* Country */}
                            <MenuItem value="Country">Country</MenuItem>

                            {/* Parts Category dropdown */}
                            <Box
                                onMouseEnter={() => setProductsMenuOpen('partsCategory')}
                                onMouseLeave={() => setProductsMenuOpen(null)}
                                sx={{ position: 'relative' }}
                            >
                                <MenuItem
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        backgroundColor: productsMenuOpen === 'partsCategory' ? '#f5f5f5' : 'inherit'
                                    }}
                                >
                                    Parts Category
                                    {productsMenuOpen === 'partsCategory' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </MenuItem>

                                {productsMenuOpen === 'partsCategory' && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            zIndex: 1,
                                            backgroundColor: '#f5f5f5',
                                            boxShadow: '0px 4px 5px -2px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseEnter={() => setProductsMenuOpen('partsCategory')}
                                        onMouseLeave={() => setProductsMenuOpen(null)}
                                    >
                                        {partsCategoryOptions.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                onClick={() => {
                                                    setProductDestination(option.value);
                                                    setProductsMenuOpen(null);
                                                }}
                                                sx={{
                                                    pl: 6,
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    backgroundColor: '#f5f5f5',
                                                    '&:hover': {
                                                        backgroundColor: '#e0e0e0',
                                                    }
                                                }}
                                            >
                                                {option.display}
                                            </MenuItem>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Select>
                    </FormControl>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCategorySelector;
