import React, { useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Chip,
    Paper,
    Slider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Build as BuildIcon,
    FiberManualRecord as FiberManualRecordIcon,
    ArrowRightAlt as ArrowRightAltIcon,
    TextFields as TextFieldsIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const ProductPartsEditorStep = ({
    productDestination,
    image,
    hotspots,
    setHotspots,
    lines,
    setLines,
    textBoxes,
    setTextBoxes,
    zoomLevel,
    setZoomLevel,
    imageSize,
    setImageSize,
    containerSize,
    setContainerSize,
    hotspotData,
    setHotspotData,
    textBoxData,
    setTextBoxData,
    hotspotDialogOpen,
    setHotspotDialogOpen,
    textBoxDialogOpen,
    setTextBoxDialogOpen,
    selectedHotspot,
    setSelectedHotspot,
    selectedTextBox,
    setSelectedTextBox,
    onNext,
    onBack
}) => {
    const imageContainerRef = useRef(null);
    const imageRef = useRef(null);

    const [isAddingHotspot, setIsAddingHotspot] = React.useState(false);
    const [isAddingLine, setIsAddingLine] = React.useState(false);
    const [isAddingTextBox, setIsAddingTextBox] = React.useState(false);
    const [currentLine, setCurrentLine] = React.useState(null);
    const [draggingHotspot, setDraggingHotspot] = React.useState(null);
    const [draggingLine, setDraggingLine] = React.useState(null);
    const [draggingTextBox, setDraggingTextBox] = React.useState(null);

    // Handle image load to get dimensions and container size
    useEffect(() => {
        if (imageRef.current && image) {
            const img = new Image();
            img.onload = () => {
                setImageSize({
                    width: img.width,
                    height: img.height
                });

                if (imageContainerRef.current) {
                    setContainerSize({
                        width: imageContainerRef.current.offsetWidth,
                        height: imageContainerRef.current.offsetHeight
                    });
                }
            };
            img.src = image;
        }
    }, [image, setImageSize, setContainerSize]);

    // Update container size on resize
    useEffect(() => {
        const handleResize = () => {
            if (imageContainerRef.current) {
                setContainerSize({
                    width: imageContainerRef.current.offsetWidth,
                    height: imageContainerRef.current.offsetHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setContainerSize]);

    // Calculate position based on zoom level
    const getPosition = (e) => {
        if (!imageContainerRef.current) return { x: 0, y: 0 };

        const rect = imageContainerRef.current.getBoundingClientRect();
        const scale = zoomLevel / 100;
        const offsetX = (containerSize.width - (imageSize.width * scale)) / 2;
        const offsetY = (containerSize.height - (imageSize.height * scale)) / 2;

        const x = ((e.clientX - rect.left - offsetX) / (imageSize.width * scale)) * 100;
        const y = ((e.clientY - rect.top - offsetY) / (imageSize.height * scale)) * 100;

        return { x, y };
    };

    const handleImageClick = (e) => {
        if (!image) return;

        const { x, y } = getPosition(e);

        if (isAddingHotspot) {
            const newHotspot = {
                id: Date.now(),
                x,
                y,
                number: hotspotData.number || hotspots.length + 1,
                partName: hotspotData.partName,
                partNumber: hotspotData.partNumber,
                price: hotspotData.price,
                quantity: hotspotData.quantity,
                style: {
                    backgroundColor: '#E21E27',
                    color: 'white'
                }
            };
            setHotspots([...hotspots, newHotspot]);
            setIsAddingHotspot(false);
            setSelectedHotspot(newHotspot);
            setHotspotData({
                number: '',
                partName: '',
                partNumber: '',
                price: '',
                quantity: 1
            });
        }
        else if (isAddingLine) {
            if (!currentLine) {
                setCurrentLine({
                    startX: x,
                    startY: y,
                    endX: x,
                    endY: y
                });
            } else {
                const newLine = {
                    id: Date.now(),
                    startX: currentLine.startX,
                    startY: currentLine.startY,
                    endX: x,
                    endY: y,
                    color: '#E21E27'
                };
                setLines([...lines, newLine]);
                setCurrentLine(null);
                setIsAddingLine(false);
            }
        }
        else if (isAddingTextBox) {
            const newTextBox = {
                id: Date.now(),
                x,
                y,
                hotspotNumber: hotspotData.number || textBoxData.hotspotNumber,
                partName: hotspotData.partName || textBoxData.partName,
                partNumber: hotspotData.partNumber || textBoxData.partNumber,
                price: hotspotData.price || textBoxData.price,
                quantity: hotspotData.quantity || textBoxData.quantity || 1
            };
            setTextBoxes([...textBoxes, newTextBox]);
            setIsAddingTextBox(false);
            setSelectedTextBox(newTextBox);
        }
    };

    // Calculate scaled dimensions and offsets for proper positioning
    const scaledWidth = (imageSize.width * zoomLevel) / 100;
    const scaledHeight = (imageSize.height * zoomLevel) / 100;

    const canProceed = () => {
        return true; // Parts editor is optional
    };

    // Skip this step if not Parts Category
    if (!productDestination.startsWith('Parts Category')) {
        // Auto-advance to next step
        React.useEffect(() => {
            onNext();
        }, [onNext]);
        
        return null;
    }

    return (
        <Card elevation={2} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    background: 'linear-gradient(90deg, #f3e5f5 0%, #e8f5e8 100%)',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            boxShadow: 1
                        }}>
                            <BuildIcon sx={{ color: '#9C27B0', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                Step 4: Parts Editor
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Add interactive hotspots and labels to your parts diagram
                            </Typography>
                        </Box>
                        <Chip 
                            label="Optional" 
                            color="info" 
                            variant="outlined"
                            sx={{ ml: 'auto' }}
                        />
                    </Stack>
                </Box>
                
                <Box sx={{ p: 4 }}>
                    {!image ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No image available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Please upload an image in the previous step to use the parts editor.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Editor Controls */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Button
                                        variant={isAddingHotspot ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            setIsAddingHotspot(!isAddingHotspot);
                                            setIsAddingLine(false);
                                            setIsAddingTextBox(false);
                                            setCurrentLine(null);
                                        }}
                                        startIcon={<FiberManualRecordIcon />}
                                        size="small"
                                        sx={{ color: isAddingHotspot ? 'white' : '#E21E27', borderColor: '#E21E27' }}
                                    >
                                        {isAddingHotspot ? 'Click to Place Hotspot' : 'Add Hotspot'}
                                    </Button>
                                    <Button
                                        variant={isAddingLine ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            setIsAddingLine(!isAddingLine);
                                            setIsAddingHotspot(false);
                                            setIsAddingTextBox(false);
                                        }}
                                        startIcon={<ArrowRightAltIcon />}
                                        size="small"
                                        sx={{ color: isAddingLine ? 'white' : '#E21E27', borderColor: '#E21E27' }}
                                    >
                                        {isAddingLine ? 'Click to Draw Line' : 'Add Line'}
                                    </Button>
                                    <Button
                                        variant={isAddingTextBox ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            setIsAddingTextBox(!isAddingTextBox);
                                            setIsAddingHotspot(false);
                                            setIsAddingLine(false);
                                            setCurrentLine(null);
                                        }}
                                        startIcon={<TextFieldsIcon />}
                                        size="small"
                                        sx={{ color: isAddingTextBox ? 'white' : '#E21E27', borderColor: '#E21E27' }}
                                    >
                                        {isAddingTextBox ? 'Click to Place Text Box' : 'Add Text Box'}
                                    </Button>
                                </Box>
                                <Box sx={{ width: 150 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Zoom: {zoomLevel}%
                                    </Typography>
                                    <Slider
                                        value={zoomLevel}
                                        onChange={(e, newValue) => setZoomLevel(newValue)}
                                        min={25}
                                        max={200}
                                        step={25}
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            {/* Image Editor */}
                            <Paper 
                                variant="outlined" 
                                sx={{ 
                                    mb: 3,
                                    border: '2px solid #e0e0e0',
                                    borderRadius: 2,
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    ref={imageContainerRef}
                                    sx={{
                                        position: 'relative',
                                        overflow: 'auto',
                                        height: 600,
                                        backgroundColor: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: isAddingHotspot || isAddingLine || isAddingTextBox ? 'crosshair' : 'default'
                                    }}
                                    onClick={handleImageClick}
                                >
                                    <div style={{
                                        position: 'relative',
                                        width: `${scaledWidth}px`,
                                        height: `${scaledHeight}px`
                                    }}>
                                        <img
                                            ref={imageRef}
                                            src={image}
                                            alt="Parts diagram"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />

                                        {/* Render hotspots */}
                                        {hotspots.map((hotspot) => (
                                            <Box
                                                key={hotspot.id}
                                                sx={{
                                                    position: 'absolute',
                                                    left: `${hotspot.x}%`,
                                                    top: `${hotspot.y}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    backgroundColor: hotspot.style.backgroundColor,
                                                    color: hotspot.style.color,
                                                    fontWeight: 'bold',
                                                    boxShadow: 2,
                                                    '&:hover': {
                                                        transform: 'translate(-50%, -50%) scale(1.2)',
                                                        boxShadow: 4
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedHotspot(hotspot);
                                                    setHotspotData({
                                                        number: hotspot.number,
                                                        partName: hotspot.partName,
                                                        partNumber: hotspot.partNumber,
                                                        price: hotspot.price,
                                                        quantity: hotspot.quantity
                                                    });
                                                    setHotspotDialogOpen(true);
                                                }}
                                            >
                                                {hotspot.number}
                                            </Box>
                                        ))}

                                        {/* Render text boxes */}
                                        {textBoxes.map((textBox) => (
                                            <Box
                                                key={textBox.id}
                                                sx={{
                                                    position: 'absolute',
                                                    left: `${textBox.x}%`,
                                                    top: `${textBox.y}%`,
                                                    width: '280px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    padding: '12px',
                                                    backgroundColor: '#f9f9f9',
                                                    zIndex: 2,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTextBox(textBox);
                                                    setTextBoxData({
                                                        hotspotNumber: textBox.hotspotNumber,
                                                        partName: textBox.partName,
                                                        partNumber: textBox.partNumber,
                                                        price: textBox.price,
                                                        quantity: textBox.quantity
                                                    });
                                                    setTextBoxDialogOpen(true);
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                    {textBox.partName || 'Part Name'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {textBox.partNumber || 'Part Number'}
                                                </Typography>
                                                {textBox.price && (
                                                    <Typography variant="subtitle2" sx={{ color: '#E21E27', fontWeight: 'bold' }}>
                                                        ${textBox.price}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </div>
                                </Box>
                            </Paper>

                            {/* Hotspot List */}
                            {hotspots.length > 0 && (
                                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Hotspots ({hotspots.length})
                                    </Typography>
                                    <Box sx={{ display: 'grid', gap: 1 }}>
                                        {hotspots.map((hotspot) => (
                                            <Box key={hotspot.id} sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                backgroundColor: 'white',
                                                borderRadius: 1,
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <Box sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    backgroundColor: hotspot.style.backgroundColor,
                                                    color: hotspot.style.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {hotspot.number}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {hotspot.partName || 'Unnamed Part'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {hotspot.partNumber || 'No part number'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                                                    {hotspot.price ? `$${hotspot.price}` : '-'}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedHotspot(hotspot);
                                                        setHotspotData({
                                                            number: hotspot.number,
                                                            partName: hotspot.partName,
                                                            partNumber: hotspot.partNumber,
                                                            price: hotspot.price,
                                                            quantity: hotspot.quantity
                                                        });
                                                        setHotspotDialogOpen(true);
                                                    }}
                                                    color="primary"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setHotspots(hotspots.filter(h => h.id !== hotspot.id))}
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
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
                            sx={{ 
                                px: 4,
                                backgroundColor: '#9C27B0',
                                '&:hover': {
                                    backgroundColor: '#7B1FA2'
                                }
                            }}
                        >
                            Next: Review & Submit
                        </Button>
                    </Box>
                </Box>
            </CardContent>

            {/* Hotspot Dialog */}
            <Dialog open={hotspotDialogOpen} onClose={() => setHotspotDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Hotspot</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Hotspot Number"
                        type="number"
                        fullWidth
                        value={hotspotData.number}
                        onChange={(e) => setHotspotData({ ...hotspotData, number: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Part Name"
                        fullWidth
                        value={hotspotData.partName}
                        onChange={(e) => setHotspotData({ ...hotspotData, partName: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Part Number"
                        fullWidth
                        value={hotspotData.partNumber}
                        onChange={(e) => setHotspotData({ ...hotspotData, partNumber: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={hotspotData.price}
                        onChange={(e) => setHotspotData({ ...hotspotData, price: e.target.value })}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={hotspotData.quantity}
                        onChange={(e) => setHotspotData({ ...hotspotData, quantity: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHotspotDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={() => {
                            const updatedHotspots = hotspots.map(h =>
                                h.id === selectedHotspot.id ? {
                                    ...h,
                                    number: hotspotData.number,
                                    partName: hotspotData.partName,
                                    partNumber: hotspotData.partNumber,
                                    price: hotspotData.price,
                                    quantity: hotspotData.quantity
                                } : h
                            );
                            setHotspots(updatedHotspots);
                            setHotspotDialogOpen(false);
                        }}
                        variant="contained"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ProductPartsEditorStep;
