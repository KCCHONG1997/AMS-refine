import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Slider,
    InputAdornment,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    LinearProgress,
    Card,
    CardContent,
    Stack,
    Chip
} from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CategoryIcon from '@mui/icons-material/Category';

// Import our organized components
import ProductHeader from '../../components/AddProduct/ProductHeader';
import ProductCategorySelector from '../../components/AddProduct/ProductCategorySelector';
import ProductBasicInfo from '../../components/AddProduct/ProductBasicInfo';
import ProductImageUpload from '../../components/AddProduct/ProductImageUpload';
import ProductCategoryDropdown from '../../components/AddProduct/ProductCategoryDropdown';

const AddProduct = () => {
    // Basic form states
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [productDestination, setProductDestination] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [productsMenuOpen, setProductsMenuOpen] = useState(null);
    const [colors, setColors] = useState(['', '', '']); // For country destination colors
    const [colourImages, setColourImages] = useState([null, null, null]); // For all colour images
    const [mainColourImage, setMainColourImage] = useState(null);
    const [colour1Image, setColour1Image] = useState(null);
    const [colour2Image, setColour2Image] = useState(null);

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

    const [additionalFields, setAdditionalFields] = useState({
        displacement: '',
        year: '',
        modelCode: '',
        colorCode: '',
    });

    const displacementOptions = [
        { display: '~124 cc', value: 'Displacement: ~124 cc' },
        { display: '125 ~ 349 cc', value: 'Displacement: 125 ~ 349 cc' },
        { display: '350 ~ 699 cc', value: 'Displacement: 350 ~ 699 cc' },
        { display: '700 ~ 1099 cc', value: 'Displacement: 700 ~ 1099 cc' },
        { display: '1100 cc ~', value: 'Displacement: 1100 cc ~' }
    ];

    const partsCategoryOptions = [
        { display: 'Engine', value: 'Parts Category: Engine' },
        { display: 'Frame', value: 'Parts Category: Frame' }
    ];

    // Editor states
    const [hotspots, setHotspots] = useState([]);
    const [lines, setLines] = useState([]);
    const [textBoxes, setTextBoxes] = useState([]);
    const [isAddingHotspot, setIsAddingHotspot] = useState(false);
    const [isAddingLine, setIsAddingLine] = useState(false);
    const [isAddingTextBox, setIsAddingTextBox] = useState(false);
    const [currentLine, setCurrentLine] = useState(null);
    const [selectedHotspot, setSelectedHotspot] = useState(null);
    const [selectedTextBox, setSelectedTextBox] = useState(null);
    const [hotspotDialogOpen, setHotspotDialogOpen] = useState(false);
    const [textBoxDialogOpen, setTextBoxDialogOpen] = useState(false);
    const [hotspotData, setHotspotData] = useState({
        number: '',
        partName: '',
        partNumber: '',
        price: '',
        quantity: 1
    });
    const [textBoxData, setTextBoxData] = useState({
        hotspotNumber: '',
        partName: '',
        partNumber: '',
        price: '',
        quantity: 1
    });
    const [zoomLevel, setZoomLevel] = useState(80);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [draggingHotspot, setDraggingHotspot] = useState(null);
    const [draggingLine, setDraggingLine] = useState(null);
    const [draggingTextBox, setDraggingTextBox] = useState(null);
    const imageContainerRef = useRef(null);
    const imageRef = useRef(null);
    const [price, setPrice] = useState('');

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
    }, [image]);

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
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
            setHotspots([]);
            setLines([]);
            setTextBoxes([]);
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
            setHotspots([]);
            setLines([]);
            setTextBoxes([]);
        }
    };

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
        if (!image || !productDestination.startsWith('Parts Category')) return;

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
            setHotspotData({
                number: '',
                partName: '',
                partNumber: '',
                price: '',
                quantity: 1
            });
            setTextBoxData({
                hotspotNumber: '',
                partName: '',
                partNumber: '',
                price: '',
                quantity: 1
            });
        }
    };
    const handleImageMouseMove = (e) => {
        const { x, y } = getPosition(e);

        if (currentLine) {
            setCurrentLine({
                ...currentLine,
                endX: x,
                endY: y
            });
        }

        if (draggingHotspot) {
            setHotspots(hotspots.map(h =>
                h.id === draggingHotspot.id ? { ...h, x, y } : h
            ));
        }

        if (draggingLine) {
            const deltaX = x - draggingLine.mouseX;
            const deltaY = y - draggingLine.mouseY;

            setLines(lines.map(l => {
                if (l.id === draggingLine.id) {
                    return {
                        ...l,
                        startX: l.startX + deltaX,
                        startY: l.startY + deltaY,
                        endX: l.endX + deltaX,
                        endY: l.endY + deltaY
                    };
                }
                return l;
            }));

            setDraggingLine({
                ...draggingLine,
                mouseX: x,
                mouseY: y
            });
        }

        if (draggingTextBox) {
            setTextBoxes(textBoxes.map(t =>
                t.id === draggingTextBox.id ? { ...t, x, y } : t
            ));
        }
    };

    const handleMouseUp = () => {
        setDraggingHotspot(null);
        setDraggingLine(null);
        setDraggingTextBox(null);
    };

    const startDraggingHotspot = (hotspot, e) => {
        e.stopPropagation();
        setDraggingHotspot(hotspot);
    };

    const startDraggingLine = (line, e) => {
        e.stopPropagation();
        const { x, y } = getPosition(e);
        setDraggingLine({
            id: line.id,
            mouseX: x,
            mouseY: y
        });
    };

    const startDraggingTextBox = (textBox, e) => {
        e.stopPropagation();
        setDraggingTextBox(textBox);
    };

    const handleHotspotEdit = (hotspot) => {
        setSelectedHotspot(hotspot);
        setHotspotData({
            number: hotspot.number,
            partName: hotspot.partName,
            partNumber: hotspot.partNumber,
            price: hotspot.price,
            quantity: hotspot.quantity
        });
        setHotspotDialogOpen(true);
    };

    const handleTextBoxEdit = (textBox) => {
        setSelectedTextBox(textBox);
        setTextBoxData({
            hotspotNumber: textBox.hotspotNumber,
            partName: textBox.partName,
            partNumber: textBox.partNumber,
            price: textBox.price,
            quantity: textBox.quantity
        });
        setTextBoxDialogOpen(true);
    };

    const handleHotspotSave = () => {
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

        // Update any textboxes linked to this hotspot
        setTextBoxes(textBoxes.map(t =>
            t.hotspotNumber === selectedHotspot.number ? {
                ...t,
                hotspotNumber: hotspotData.number,
                partName: hotspotData.partName,
                partNumber: hotspotData.partNumber,
                price: hotspotData.price,
                quantity: hotspotData.quantity
            } : t
        ));

        setHotspotDialogOpen(false);
    };

    const handleTextBoxSave = () => {
        const updatedTextBoxes = textBoxes.map(t =>
            t.id === selectedTextBox.id ? {
                ...t,
                hotspotNumber: textBoxData.hotspotNumber,
                partName: textBoxData.partName,
                partNumber: textBoxData.partNumber,
                price: textBoxData.price,
                quantity: textBoxData.quantity
            } : t
        );
        setTextBoxes(updatedTextBoxes);

        // Update the linked hotspot if it exists
        setHotspots(hotspots.map(h =>
            h.number === selectedTextBox.hotspotNumber ? {
                ...h,
                number: textBoxData.hotspotNumber,
                partName: textBoxData.partName,
                partNumber: textBoxData.partNumber,
                price: textBoxData.price,
                quantity: textBoxData.quantity
            } : h
        ));

        setTextBoxDialogOpen(false);
    };

    const handleHotspotDelete = (id) => {
        setHotspots(hotspots.filter(h => h.id !== id));
        setLines(lines.filter(l =>
            !hotspots.find(h => h.id === id &&
                (l.startX === h.x && l.startY === h.y || l.endX === h.x && l.endY === h.y))
        ));
    };

    const handleLineDelete = (id) => {
        setLines(lines.filter(l => l.id !== id));
    };

    const handleTextBoxDelete = (id) => {
        setTextBoxes(textBoxes.filter(t => t.id !== id));
    };

    const checkForDuplicateTitle = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/products/check-title?title=${encodeURIComponent(title)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('Error checking duplicate title:', error);
            return false;
        }
    };

    const handleSubmit = async () => {
        try {
            // Check for duplicate title
            const isDuplicate = await checkForDuplicateTitle();
            if (isDuplicate) {
                setSnackbarMessage('A product with this title already exists!');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            setConfirmDialogOpen(true);
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage('Error checking for duplicate title');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const confirmSubmit = async () => {
        setConfirmDialogOpen(false);
        // Frontend validation for required fields
        if (!title.trim()) {
            setSnackbarMessage('Title is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (!productDestination) {
            setSnackbarMessage('Destination is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (showImageUpload && !image) {
            setSnackbarMessage('Image upload is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (productDestination === 'Country' && colors[0] === '') {
            setSnackbarMessage('At least one color is required for country destination');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        // Only validate price for destinations that actually show the price field
        if (
            !(
                productDestination === 'Year' ||
                productDestination === 'Model' ||
                productDestination === 'Country' ||
                productDestination === 'Brands We Carry' ||
                productDestination === "" ||
                productDestination.startsWith('Displacement') ||
                productDestination.startsWith('Parts Category')
            )
            && (!price || isNaN(Number(price)) || Number(price) <= 0)
        ) {
            setSnackbarMessage('Price is required and must be a number greater than 0');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const formData = new FormData();

            // Append basic product fields
            formData.append('title', title);
            formData.append('destination', productDestination);
            formData.append('hotspots', JSON.stringify(hotspots));
            formData.append('lines', JSON.stringify(lines));
            formData.append('textBoxes', JSON.stringify(textBoxes));

            // Append additional fields for country destination
            if (productDestination === 'Country') {
                formData.append('displacement', additionalFields.displacement);
                formData.append('year', additionalFields.year);
                formData.append('modelCode', additionalFields.modelCode);
                formData.append('colors', JSON.stringify(colors.filter(c => c !== '')));

                for (let i = 0; i < colourImages.length; i++) {
                    if (colourImages[i]) {
                        const blob = await fetch(colourImages[i]).then(r => r.blob());
                        formData.append(`colourImage${i}`, blob, `colour${i}.jpg`);
                    }
                }
            }

            // Append image if present
            const fileInput = document.getElementById('image-upload');
            if (fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            // Append other fields
            formData.append('price', Number(price));
            formData.append('description', '');

            // Send product creation request
            const response = await fetch('http://localhost:3002/api/products', {
                method: 'POST',
                body: formData,
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error('Server error: ' + text);
            }

            if (!response.ok) {
                let errorMsg = data.message || data.errors;
                if (typeof errorMsg === 'object') {
                    errorMsg = JSON.stringify(errorMsg);
                }
                throw new Error(errorMsg || 'Network response was not ok');
            }

            const productId = data.id; // Assumes backend returns new product ID here

            // Now submit each hotspot as a part linked to this product
            for (const hs of hotspots) {
                const partPayload = {
                    productId,
                    partName: hs.partName,
                    partNumber: hs.partNumber || '',
                    price: Number(hs.price),
                    quantity: Number(hs.quantity),
                    number: hs.number,
                };

                const partResponse = await fetch('http://localhost:3002/api/parts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(partPayload),
                });

                if (!partResponse.ok) {
                    const errorText = await partResponse.text();
                    throw new Error('Failed to save part: ' + errorText);
                }
            }

            console.log('Success: Product and parts saved', data);

            setSnackbarMessage('Product and parts added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Reset form
            setImage(null);
            setTitle('');
            setProductDestination('');
            setHotspots([]);
            setLines([]);
            setTextBoxes([]);
            setColors(['', '', '']);
            setColourImages([null, null, null]);
            setPrice('');
            setAdditionalFields({
                displacement: '',
                year: '',
                modelCode: '',
                colorCode: '',
            });

        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage(error.message || 'Error adding product');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const addColorField = () => {
        setColors([...colors, '']);
    };

    const removeColorField = (index) => {
        const newColors = [...colors];
        newColors.splice(index, 1);
        setColors(newColors);

        const newColourImages = [...colourImages];
        newColourImages.splice(index, 1);
        setColourImages(newColourImages);
    };

    const handleColorChange = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    // Calculate scaled dimensions and offsets for proper positioning
    const scaledWidth = (imageSize.width * zoomLevel) / 100;
    const scaledHeight = (imageSize.height * zoomLevel) / 100;
    const offsetX = (containerSize.width - scaledWidth) / 2;
    const offsetY = (containerSize.height - scaledHeight) / 2;

    // Check if image upload should be shown
    // Update the showImageUpload check to:
    const showImageUpload = !productDestination.startsWith('Displacement') &&
        productDestination !== 'Year' &&
        productDestination !== 'Model';

    // Calculate form completion progress
    const calculateProgress = () => {
        let completed = 0;
        let total = 3; // Basic steps: destination, title, image
        
        if (productDestination) completed++;
        if (title.trim()) completed++;
        if (!showImageUpload || image) completed++;
        
        // Add country-specific requirements
        if (productDestination === 'Country') {
            total += 1;
            if (colors[0] !== '') completed++;
        }
        
        return (completed / total) * 100;
    };

    const progress = calculateProgress();

    return (
        <Box sx={{ 
            maxWidth: 1200, 
            margin: 'auto', 
            padding: { xs: 2, md: 4 },
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        }}>
            {/* Header Section */}
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

            {/* Main Form Content */}
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    {/* Step 1: Product Destination */}
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
                                <ProductCategoryDropdown
                                    value={productDestination}
                                    onChange={setProductDestination}
                                    displacementOptions={displacementOptions}
                                    partsCategoryOptions={partsCategoryOptions}
                                />

            {/* Title */}
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
                Title
            </Typography>
            <TextField
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                multiline
                maxRows={3}
                label="Title"
                sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        '& fieldset': {
                            borderColor: '#ccc',
                        },
                        '&:hover fieldset': {
                            borderColor: '#225095',
                        },
                    },
                }}
            />

            {/* Country Destination Fields */}
            {productDestination === 'Country' && (
                <>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
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
                    />

                    {/* Model Code Field */}
                    <TextField
                        fullWidth
                        label="Model Code"
                        value={additionalFields.modelCode}
                        onChange={(e) => setAdditionalFields({ ...additionalFields, modelCode: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    {/* Color Code Field */}
                    <TextField
                        fullWidth
                        label="Color Code"
                        value={additionalFields.colorCode}
                        onChange={(e) => setAdditionalFields({ ...additionalFields, colorCode: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    {/* Colors Section */}
                    <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
                        Colors
                    </Typography>
                    {colors.map((color, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                fullWidth
                                label={`Color ${index + 1}`}
                                value={color}
                                onChange={(e) => handleColorChange(index, e.target.value)}
                                sx={{ mr: 2 }}
                            />
                            {index > 0 && (
                                <IconButton onClick={() => removeColorField(index)} color="error">
                                    <RemoveIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addColorField}
                        sx={{ mb: 2 }}
                    >
                        Add Color
                    </Button>

                    {/* Color Images Section */}
                    <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
                        Color Images
                    </Typography>
                    {colors.map((color, index) => (
                        color && (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Typography variant="body1" gutterBottom>
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
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            borderColor: '#225095',
                                        },
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
                                                style={{ maxHeight: '100px', maxWidth: '100%' }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Click to change image
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <CloudUploadIcon sx={{ fontSize: 60, color: '#225095', mb: 1 }} />
                                            <Typography variant="body1" gutterBottom>
                                                Drag and drop {color} image here or
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Browse File
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
                            </Box>
                        )
                    ))}
                </>
            )}

            {/* Price Field */}
            {(productDestination === 'Year' ||
                productDestination === 'Model' ||
                productDestination === 'Brands We Carry' ||
                productDestination === 'Country'
            ) ? null : (
                // Only show price for destinations NOT: default (""), Brands We Carry, Year, Model, Country,
                // Displacement options, or Parts Category options
                !(
                    productDestination === "" ||
                    productDestination.startsWith('Displacement') ||
                    productDestination.startsWith('Parts Category')
                ) && (
                    <TextField
                        fullWidth
                        label="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        type="number"
                        required
                        sx={{ mb: 4 }}
                    />
                )
            )}

            {/* Image Upload - Only show for certain destinations */}
            {
                showImageUpload && (
                    <>
                        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
                            Upload Image
                        </Typography>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 2,
                                height: 150, // Add this line
                                border: '2px dashed #ccc',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: image ? 'transparent' : '#fafafa',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                    borderColor: '#225095',
                                },
                            }}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('image-upload').click()}
                        >
                            {image ? (
                                <Typography variant="body2" color="text.secondary">
                                    Click to change image
                                </Typography>
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 60, color: '#225095', mb: 1 }} />
                                    <Typography variant="body1" gutterBottom>
                                        Drag and drop an image here or
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Browse File
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
                    </>
                )
            }

            {
                image && (
                    <>
                        {/* Editor Controls - Only show when Parts Category is selected */}
                        {productDestination.startsWith('Parts Category') && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Button
                                        variant={isAddingHotspot ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            setIsAddingHotspot(!isAddingHotspot);
                                            setIsAddingLine(false);
                                            setIsAddingTextBox(false);
                                            setCurrentLine(null);
                                        }}
                                        sx={{ mr: 1 }}
                                        startIcon={<FiberManualRecordIcon />}
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
                                        sx={{ mr: 1 }}
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
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Image Editor */}
                        <Box
                            ref={imageContainerRef}
                            sx={{
                                position: 'relative',
                                border: '1px solid #ccc',
                                overflow: 'auto',
                                height: 800,
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onClick={handleImageClick}
                            onMouseMove={productDestination.startsWith('Parts Category') ? handleImageMouseMove : undefined}
                            onMouseUp={productDestination.startsWith('Parts Category') ? handleMouseUp : undefined}
                            onMouseLeave={productDestination.startsWith('Parts Category') ? handleMouseUp : undefined}
                        >
                            <div style={{
                                position: 'relative',
                                width: `${scaledWidth}px`,
                                height: `${scaledHeight}px`
                            }}>
                                <img
                                    ref={imageRef}
                                    src={image}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />

                                {/* Render automated lines connecting hotspots to their text boxes */}
                                {productDestination.startsWith('Parts Category') && hotspots.map((hotspot) => {
                                    const textBox = textBoxes.find(tb => String(tb.hotspotNumber) === String(hotspot.number));
                                    if (!textBox) return null;
                                    const startX = hotspot.x;
                                    const startY = hotspot.y;
                                    const textBoxWidth = 280; // px
                                    const textBoxHeight = 80; // px (estimate)
                                    const centerX = textBox.x + (textBoxWidth / 2 / scaledWidth) * 100;
                                    const centerY = textBox.y + (textBoxHeight / 2 / scaledHeight) * 100;
                                    const midX = (startX + centerX) / 2;
                                    const midY = (startY + centerY) / 2;

                                    return (
                                        <svg
                                            key={`auto-line-${hotspot.id}-${textBox.id}`}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                pointerEvents: 'none',
                                                zIndex: 0 // Send to back
                                            }}
                                        >
                                            <line
                                                x1={`${startX}%`}
                                                y1={`${startY}%`}
                                                x2={`${centerX}%`}
                                                y2={`${centerY}%`}
                                                stroke="#E21E27"
                                                strokeWidth="2"
                                            />
                                            {/* Delete button at midpoint */}
                                            <foreignObject
                                                x={`${midX - 1}%`}
                                                y={`${midY - 1}%`}
                                                width="20"
                                                height="20"
                                                style={{ pointerEvents: 'all' }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        border: '1px solid #E21E27'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTextBoxes(textBoxes.map(tb =>
                                                            tb.id === textBox.id
                                                                ? { ...tb, hotspotNumber: '' }
                                                                : tb
                                                        ));
                                                    }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 14, color: '#E21E27' }} />
                                                </Box>
                                            </foreignObject>
                                        </svg>
                                    );
                                })}

                                {/* Render lines */}
                                {productDestination.startsWith('Parts Category') && lines.map((line) => (
                                    <svg
                                        key={line.id}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <line
                                            x1={`${line.startX}%`}
                                            y1={`${line.startY}%`}
                                            x2={`${line.endX}%`}
                                            y2={`${line.endY}%`}
                                            stroke={line.color || '#E21E27'}
                                            strokeWidth="2"
                                            pointerEvents="visibleStroke"
                                            onMouseDown={(e) => startDraggingLine(line, e)}
                                            style={{ cursor: 'move' }}
                                        />
                                        <foreignObject
                                            x={`${(line.startX + line.endX) / 2 - 1}%`}
                                            y={`${(line.startY + line.endY) / 2 - 1}%`}
                                            width="20"
                                            height="20"
                                            style={{ pointerEvents: 'all' }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    border: '1px solid #E21E27'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLineDelete(line.id);
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 14, color: '#E21E27' }} />
                                            </Box>
                                        </foreignObject>
                                    </svg>
                                ))}

                                {/* Render current line being drawn */}
                                {productDestination.startsWith('Parts Category') && currentLine && (
                                    <svg
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <line
                                            x1={`${currentLine.startX}%`}
                                            y1={`${currentLine.startY}%`}
                                            x2={`${currentLine.endX}%`}
                                            y2={`${currentLine.endY}%`}
                                            stroke="#E21E27"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                )}


                                {/* Render hotspots */}
                                {productDestination.startsWith('Parts Category') && hotspots.map((hotspot) => (
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
                                            cursor: 'move',
                                            backgroundColor: hotspot.style.backgroundColor,
                                            color: hotspot.style.color,
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                transform: 'translate(-50%, -50%) scale(1.2)'
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleHotspotEdit(hotspot);
                                        }}
                                        onMouseDown={(e) => startDraggingHotspot(hotspot, e)}
                                    >
                                        {hotspot.number}
                                    </Box>
                                ))}

                                {/* Render text boxes */}
                                {productDestination.startsWith('Parts Category') && textBoxes.map((textBox) => (
                                    <Box
                                        key={textBox.id}
                                        sx={{
                                            position: 'absolute',
                                            left: `${textBox.x}%`,
                                            top: `${textBox.y}%`,
                                            width: '280px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            backgroundColor: '#f9f9f9',
                                            zIndex: 2,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '50%',
                                                left: '-10px',
                                                width: '0',
                                                height: '0',
                                                borderTop: '10px solid transparent',
                                                borderBottom: '10px solid transparent',
                                                borderRight: '10px solid #e0e0e0',
                                                transform: 'translateY(-50%)'
                                            },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '50%',
                                                left: '-9px',
                                                width: '0',
                                                height: '0',
                                                borderTop: '10px solid transparent',
                                                borderBottom: '10px solid transparent',
                                                borderRight: '10px solid #f9f9f9',
                                                transform: 'translateY(-50%)'
                                            },
                                            cursor: 'move',
                                            '&:hover': {
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                        onMouseDown={(e) => startDraggingTextBox(textBox, e)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTextBoxEdit(textBox);
                                        }}
                                    >
                                        {/* Delete button in top right */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTextBoxDelete(textBox.id);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                zIndex: 3,
                                                color: '#E21E27',
                                                background: '#fff',
                                                '&:hover': { background: '#ffeaea' }
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 'bold',
                                            mb: 1,
                                            fontSize: '1rem',
                                            color: '#000000'
                                        }}>
                                            {textBox.partName}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            mb: 1,
                                            fontSize: '0.9rem',
                                            color: '#555'
                                        }}>
                                            {textBox.partNumber}
                                        </Typography>
                                        {textBox.price && (
                                            <>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 'bold',
                                                    mb: 1,
                                                    fontSize: '1.1rem',
                                                    color: '#E21E27'
                                                }}>
                                                    ${textBox.price}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    color: '#666',
                                                    mb: 2,
                                                    fontSize: '0.8rem'
                                                }}>
                                                    Unit Price Ind. Tax
                                                </Typography>
                                            </>
                                        )}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px'
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: 'white',
                                                borderRadius: '20px',
                                                padding: '4px 8px',
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <Button
                                                    variant="text"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTextBoxes(textBoxes.map(t =>
                                                            t.id === textBox.id ?
                                                                { ...t, quantity: Math.max(1, parseInt(t.quantity) - 1) } :
                                                                t
                                                        ));
                                                    }}
                                                    sx={{
                                                        minWidth: '32px',
                                                        padding: '4px',
                                                        color: '#E21E27',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(226, 30, 39, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    -
                                                </Button>
                                                <input
                                                    type="number"
                                                    value={textBox.quantity}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        const value = parseInt(e.target.value);
                                                        if (!isNaN(value)) {
                                                            setTextBoxes(textBoxes.map(t =>
                                                                t.id === textBox.id ?
                                                                    { ...t, quantity: Math.max(1, value) } :
                                                                    t
                                                            ));
                                                        }
                                                    }}
                                                    min="1"
                                                    style={{
                                                        width: '40px',
                                                        textAlign: 'center',
                                                        border: 'none',
                                                        outline: 'none',
                                                        fontSize: '1rem',
                                                        padding: '4px'
                                                    }}
                                                />
                                                <Button
                                                    variant="text"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTextBoxes(textBoxes.map(t =>
                                                            t.id === textBox.id ?
                                                                { ...t, quantity: parseInt(t.quantity) + 1 } :
                                                                t
                                                        ));
                                                    }}
                                                    sx={{
                                                        minWidth: '32px',
                                                        padding: '4px',
                                                        color: '#E21E27',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(226, 30, 39, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                            <Box sx={{
                                                backgroundImage: 'url("/Add_To_Cart.png")',
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    opacity: 0.8
                                                }
                                            }} />
                                        </Box>
                                    </Box>
                                ))}

                                {/* Render current line being drawn */}
                                {productDestination.startsWith('Parts Category') && currentLine && (
                                    <svg
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <line
                                            x1={`${currentLine.startX}%`}
                                            y1={`${currentLine.startY}%`}
                                            x2={`${currentLine.endX}%`}
                                            y2={`${currentLine.endY}%`}
                                            stroke="#E21E27"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                )}
                            </div>
                        </Box>

                        {/* Hotspot List - Only show when Parts Category is selected */}
                        {productDestination.startsWith('Parts Category') && hotspots.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
                                    Hotspot List
                                </Typography>
                                <Paper sx={{ p: 2, mb: 4 }}>
                                    {hotspots.map((hotspot) => (
                                        <Box key={hotspot.id} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1,
                                            p: 1,
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '4px'
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
                                                fontWeight: 'bold'
                                            }}>
                                                {hotspot.number}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    {hotspot.partName || 'Unnamed Part'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {hotspot.partNumber || 'No part number'}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>
                                                {hotspot.price ? `$${hotspot.price}` : 'No price'}
                                            </Typography>
                                            <IconButton
                                                onClick={() => handleHotspotEdit(hotspot)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleHotspotDelete(hotspot.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Paper>
                            </Box>
                        )}
                    </>
                )
            }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!title || !productDestination || (showImageUpload && !image)}
                    sx={{
                        backgroundColor: '#225095',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#C21820',
                        },
                        '&:disabled': {
                            backgroundColor: '#f5f5f5',
                            color: '#ccc',
                        },
                    }}
                >
                    Submit
                </Button>
            </Box>

            {/* Hotspot Dialog */}
            <Dialog open={hotspotDialogOpen} onClose={() => setHotspotDialogOpen(false)}>
                <DialogTitle>Edit Hotspot</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Number"
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
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHotspotDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleHotspotSave}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Text Box Dialog */}
            <Dialog open={textBoxDialogOpen} onClose={() => setTextBoxDialogOpen(false)}>
                <DialogTitle>Edit Text Box</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Hotspot Number"
                        type="number"
                        fullWidth
                        value={textBoxData.hotspotNumber}
                        onChange={(e) => setTextBoxData({ ...textBoxData, hotspotNumber: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Part Name"
                        fullWidth
                        value={textBoxData.partName}
                        onChange={(e) => setTextBoxData({ ...textBoxData, partName: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Part Number"
                        fullWidth
                        value={textBoxData.partNumber}
                        onChange={(e) => setTextBoxData({ ...textBoxData, partNumber: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={textBoxData.price}
                        onChange={(e) => setTextBoxData({ ...textBoxData, price: e.target.value })}
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
                        value={textBoxData.quantity}
                        onChange={(e) => setTextBoxData({ ...textBoxData, quantity: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTextBoxDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleTextBoxSave}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to submit this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmSubmit} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddProduct;