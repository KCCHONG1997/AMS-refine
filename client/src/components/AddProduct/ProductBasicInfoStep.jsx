import React from 'react';
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    Card,
    CardContent,
    Stack,
    Chip,
    Paper
} from '@mui/material';
import {
    Info as InfoIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from '@mui/icons-material';

const ProductBasicInfoStep = ({
    productDestination,
    title,
    setTitle,
    price,
    setPrice,
    additionalFields,
    setAdditionalFields,
    colors,
    setColors,
    displacementOptions,
    onNext,
    onBack
}) => {
    const addColorField = () => {
        setColors([...colors, '']);
    };

    const removeColorField = (index) => {
        const newColors = [...colors];
        newColors.splice(index, 1);
        setColors(newColors);
    };

    const handleColorChange = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    const shouldShowPrice = () => {
        return !(
            productDestination === 'Year' ||
            productDestination === 'Model' ||
            productDestination === 'Country' ||
            productDestination === 'Brands We Carry' ||
            productDestination === '' ||
            productDestination.startsWith('Displacement') ||
            productDestination.startsWith('Parts Category')
        );
    };

    const canProceed = () => {
        const hasTitle = title.trim();
        const hasValidPrice = !shouldShowPrice() || (price && !isNaN(Number(price)) && Number(price) > 0);
        const hasRequiredColors = productDestination !== 'Country' || colors[0] !== '';
        
        return hasTitle && hasValidPrice && hasRequiredColors;
    };

    return (
        <Card elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(90deg, #e8f5e8 0%, #f0f8ff 100%)',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: 1
                        }}>
                            <InfoIcon sx={{ color: '#4CAF50', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Step 2: Basic Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enter the essential product details
                            </Typography>
                        </Box>
                        {canProceed() && (
                            <Chip 
                                label="Ready" 
                                color="success" 
                                variant="outlined"
                                sx={{ ml: 'auto' }}
                            />
                        )}
                    </Stack>
                </Box>
                
                <Box sx={{ p: 4 }}>
                    {/* Product Title */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                            Product Title *
                        </Typography>
                        <TextField
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            multiline
                            maxRows={3}
                            label="Enter product title"
                            placeholder="e.g., Honda CBR 600RR Engine Parts"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#fff',
                                    '& fieldset': {
                                        borderColor: '#ccc',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#4CAF50',
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Price Field - Conditional */}
                    {shouldShowPrice() && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                                Price *
                            </Typography>
                            <TextField
                                fullWidth
                                label="Product Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                required
                                placeholder="0.00"
                                InputProps={{
                                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                    }
                                }}
                            />
                        </Box>
                    )}

                    {/* Country-Specific Fields */}
                    {productDestination === 'Country' && (
                        <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f8f9ff', border: '1px solid #e3f2fd' }}>
                            <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
                                Additional Information
                            </Typography>
                            
                            {/* Displacement Field */}
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="displacement-label">Displacement</InputLabel>
                                <Select
                                    labelId="displacement-label"
                                    value={additionalFields.displacement}
                                    label="Displacement"
                                    onChange={(e) => setAdditionalFields({ ...additionalFields, displacement: e.target.value })}
                                >
                                    {displacementOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.display}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Year Field */}
                            <TextField
                                fullWidth
                                label="Year"
                                value={additionalFields.year}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, year: e.target.value })}
                                sx={{ mb: 2 }}
                                placeholder="e.g., 2023"
                            />

                            {/* Model Code Field */}
                            <TextField
                                fullWidth
                                label="Model Code"
                                value={additionalFields.modelCode}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, modelCode: e.target.value })}
                                sx={{ mb: 2 }}
                                placeholder="e.g., CBR600RR"
                            />

                            {/* Color Code Field */}
                            <TextField
                                fullWidth
                                label="Color Code"
                                value={additionalFields.colorCode}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, colorCode: e.target.value })}
                                sx={{ mb: 3 }}
                                placeholder="e.g., R-189"
                            />

                            {/* Colors Section */}
                            <Typography variant="h6" component="h4" gutterBottom sx={{ mb: 2 }}>
                                Available Colors *
                            </Typography>
                            {colors.map((color, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label={`Color ${index + 1}`}
                                        value={color}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        placeholder={`e.g., ${index === 0 ? 'Racing Red' : index === 1 ? 'Pearl White' : 'Matte Black'}`}
                                        sx={{ mr: 2 }}
                                    />
                                    {index > 0 && (
                                        <IconButton 
                                            onClick={() => removeColorField(index)} 
                                            color="error"
                                            sx={{ p: 1 }}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addColorField}
                                sx={{ mt: 1 }}
                                variant="outlined"
                            >
                                Add Another Color
                            </Button>
                        </Paper>
                    )}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            onClick={onBack}
                            variant="outlined"
                            sx={{ px: 4 }}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={onNext}
                            variant="contained"
                            disabled={!canProceed()}
                            sx={{ 
                                px: 4,
                                backgroundColor: '#4CAF50',
                                '&:hover': {
                                    backgroundColor: '#45a049'
                                }
                            }}
                        >
                            Next: Upload Images
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductBasicInfoStep;
