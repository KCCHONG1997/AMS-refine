import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Stack,
    Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

const ProductImageUpload = ({ 
    image, 
    handleImageChange, 
    handleDragOver, 
    handleDrop 
}) => {
    return (
        <Card elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(90deg, #e8f5e8 0%, #f3e5f5 100%)',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: 1
                        }}>
                            <ImageIcon sx={{ color: '#225095', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Step 3: Product Image
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Upload a high-quality image of your product
                            </Typography>
                        </Box>
                        {image && (
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
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            height: 200,
                            border: image ? '2px solid #4caf50' : '2px dashed #ccc',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: image ? 'rgba(76, 175, 80, 0.05)' : '#fafafa',
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: image ? 'rgba(76, 175, 80, 0.1)' : '#f5f5f5',
                                borderColor: image ? '#4caf50' : '#225095',
                                transform: 'translateY(-2px)',
                                boxShadow: 2,
                            },
                        }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('image-upload').click()}
                    >
                        {image ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                <img 
                                    src={image} 
                                    alt="Product preview" 
                                    style={{ 
                                        maxHeight: '120px', 
                                        maxWidth: '100%', 
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                    ✓ Image uploaded successfully
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Click to change image
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                                <CloudUploadIcon sx={{ 
                                    fontSize: 64, 
                                    color: '#225095', 
                                    mb: 2,
                                    animation: 'bounce 2s infinite'
                                }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                                    Drag and drop your image here
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    or click to browse files
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Supports: JPG, PNG, GIF (Max 10MB)
                                </Typography>
                            </Box>
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
            </CardContent>
        </Card>
    );
};

export default ProductImageUpload;
