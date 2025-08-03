import React from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Chip,
    Paper
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Image as ImageIcon
} from '@mui/icons-material';

const ProductImageUploadStep = ({
    productDestination,
    image,
    setImage,
    colors,
    colourImages,
    setColourImages,
    onNext,
    onBack
}) => {
    const showImageUpload = !productDestination.startsWith('Displacement') &&
        productDestination !== 'Year' &&
        productDestination !== 'Model';

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const url = URL.createObjectURL(e.dataTransfer.files[0]);
            setImage(url);
        }
    };

    const handleColourImageChange = (e, index) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            const newColourImages = [...colourImages];
            newColourImages[index] = url;
            setColourImages(newColourImages);
        }
    };

    const handleColourImageDrop = (e, index) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const url = URL.createObjectURL(e.dataTransfer.files[0]);
            const newColourImages = [...colourImages];
            newColourImages[index] = url;
            setColourImages(newColourImages);
        }
    };

    const canProceed = () => {
        if (!showImageUpload) return true; // No image required for some categories
        if (productDestination === 'Country') {
            return image && colors.filter(c => c !== '').length > 0;
        }
        return image; // Main image required for other categories
    };

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
                            <ImageIcon sx={{ color: '#FF9800', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Step 3: Upload Images
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Add visual content for your product
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
                    {!showImageUpload ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No images required for this category
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This product category doesn't require image uploads.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Main Image Upload */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                                    Main Product Image *
                                </Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 3,
                                        height: 200,
                                        border: '2px dashed #ccc',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: image ? 'transparent' : '#fafafa',
                                        borderColor: image ? '#4CAF50' : '#ccc',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            borderColor: '#FF9800',
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    {image ? (
                                        <>
                                            <img 
                                                src={image} 
                                                alt="Product preview" 
                                                style={{ 
                                                    maxHeight: '160px', 
                                                    maxWidth: '100%', 
                                                    objectFit: 'contain',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Click to change image
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <CloudUploadIcon sx={{ fontSize: 60, color: '#FF9800', mb: 2 }} />
                                            <Typography variant="h6" gutterBottom>
                                                Drag and drop an image here
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                or click to browse files
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Supported formats: JPG, PNG, GIF (Max 10MB)
                                            </Typography>
                                        </>
                                    )}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                </Paper>
                            </Box>

                            {/* Color Images for Country Products */}
                            {productDestination === 'Country' && colors.some(c => c !== '') && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 3 }}>
                                        Color-Specific Images
                                    </Typography>
                                    <Box sx={{ display: 'grid', gap: 3 }}>
                                        {colors.map((color, index) => 
                                            color && (
                                                <Paper key={index} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                                                        {color} Image
                                                    </Typography>
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            height: 150,
                                                            border: '2px dashed #ccc',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                            backgroundColor: colourImages[index] ? 'transparent' : '#fafafa',
                                                            borderColor: colourImages[index] ? '#4CAF50' : '#ccc',
                                                            '&:hover': {
                                                                backgroundColor: '#f5f5f5',
                                                                borderColor: '#1976d2',
                                                            },
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleColourImageDrop(e, index)}
                                                        onClick={() => document.getElementById(`colour-image-upload-${index}`).click()}
                                                    >
                                                        {colourImages[index] ? (
                                                            <>
                                                                <img 
                                                                    src={colourImages[index]} 
                                                                    alt={`${color} preview`} 
                                                                    style={{ 
                                                                        maxHeight: '100px', 
                                                                        maxWidth: '100%',
                                                                        objectFit: 'contain',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                />
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                    Click to change
                                                                </Typography>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CloudUploadIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                                                <Typography variant="body2" gutterBottom>
                                                                    Drop {color.toLowerCase()} image here
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    or click to browse
                                                                </Typography>
                                                            </>
                                                        )}
                                                        <input
                                                            id={`colour-image-upload-${index}`}
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleColourImageChange(e, index)}
                                                        />
                                                    </Paper>
                                                </Paper>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </>
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
                                backgroundColor: '#FF9800',
                                '&:hover': {
                                    backgroundColor: '#F57C00'
                                }
                            }}
                        >
                            {productDestination.startsWith('Parts Category') ? 'Next: Parts Editor' : 'Next: Review'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductImageUploadStep;
