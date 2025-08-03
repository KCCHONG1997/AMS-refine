import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress, TextField,
    InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel, Slider,
    Divider, Collapse, DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextFieldsIcon from '@mui/icons-material/TextFields';

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

const countryList = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
    "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
    "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
];

function DragAndDropArea({ onFileDrop, imagePreview, onCancel }) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = React.useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileDrop(e.dataTransfer.files[0]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileDrop(e.target.files[0]);
            e.target.value = '';
        }
    };

    return (
        <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
                border: '2px dashed #aaa',
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: 'center',
                backgroundColor: dragActive ? '#f0f4ff' : '#fafbfc',
                color: '#888',
                cursor: 'pointer',
                transition: 'background 0.2s',
            }}
        >
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="editproduct-drag-upload"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <label htmlFor="editproduct-drag-upload" style={{ cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#225095', mb: 1 }} />
                    <Box sx={{ fontWeight: 500 }}>
                        Upload Image
                    </Box>
                    <Box sx={{ fontWeight: 500 }}>
                        Drag &amp; drop an image here, or <span style={{ color: '#225095', textDecoration: 'underline' }}>browse</span>
                    </Box>
                </Box>
                <Box sx={{ fontSize: 13, color: '#aaa', mb: 2 }}>
                    (Upload an image to help find the product if you forgot the name)
                </Box>
                {imagePreview && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                maxWidth: 400,
                                maxHeight: 300,
                                objectFit: 'contain',
                                borderRadius: 6,
                                border: '1px solid #ddd'
                            }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, color: '#888' }}>
                            Preview
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (typeof window !== "undefined" && imagePreview && imagePreview.startsWith("blob:")) {
                                    URL.revokeObjectURL(imagePreview);
                                }
                                if (typeof onCancel === "function") onCancel();
                                // Reset the file input
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                        >
                            Cancel Upload
                        </Button>
                    </Box>
                )}
            </label>
        </Box>
    );
}

function SearchDragAndDropArea({ onFileDrop, imagePreview, onCancel }) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = React.useRef();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileDrop(e.dataTransfer.files[0]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileDrop(e.target.files[0]);
            e.target.value = '';
        }
    };

    return (
        <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
                border: '2px dashed #aaa',
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: 'center',
                backgroundColor: dragActive ? '#f0f4ff' : '#fafbfc',
                color: '#888',
                cursor: 'pointer',
                transition: 'background 0.2s',
            }}
        >
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="search-drag-upload"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <label htmlFor="search-drag-upload" style={{ cursor: 'pointer' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#225095', mb: 1 }} />
                    <Box sx={{ fontWeight: 500 }}>
                        Search by Image
                    </Box>
                    <Box sx={{ fontWeight: 500 }}>
                        Drag &amp; drop an image here, or <span style={{ color: '#225095', textDecoration: 'underline' }}>browse</span>
                    </Box>
                </Box>
                <Box sx={{ fontSize: 13, color: '#aaa', mb: 2 }}>
                    (Upload an image to help find the product)
                </Box>
                {imagePreview && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                maxWidth: 400,
                                maxHeight: 300,
                                objectFit: 'contain',
                                borderRadius: 6,
                                border: '1px solid #ddd'
                            }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, color: '#888' }}>
                            Preview
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (typeof window !== "undefined" && imagePreview && imagePreview.startsWith("blob:")) {
                                    URL.revokeObjectURL(imagePreview);
                                }
                                if (typeof onCancel === "function") onCancel();
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                        >
                            Cancel Upload
                        </Button>
                    </Box>
                )}
            </label>
        </Box>
    );
}

const EditProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [productsMenuOpen, setProductsMenuOpen] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [productDestination, setProductDestination] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [additionalFields, setAdditionalFields] = useState({
        displacement: '',
        year: '',
        modelCode: '',
        colorCode: '',
    });
    const [colors, setColors] = useState(['', '', '']);
    const [colourImages, setColourImages] = useState([null, null, null]);

    // Editor states
    const [image, setImage] = useState(null);
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

    // Image state for edit dialog
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const imagePreviewUrlRef = React.useRef(null);

    // Search image states
    const [searchImageFile, setSearchImageFile] = useState(null);
    const [searchImagePreview, setSearchImagePreview] = useState(null);
    const searchImagePreviewUrlRef = React.useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (editDialogOpen && selectedProduct) {
            // Initialize form with selected product data
            setTitle(selectedProduct.title || '');
            setProductDestination(selectedProduct.destination || '');
            setPrice(selectedProduct.price || '');
            setDescription(selectedProduct.description || '');
            setAdditionalFields({
                displacement: selectedProduct.displacement || '',
                year: selectedProduct.year || '',
                modelCode: selectedProduct.modelCode || '',
                colorCode: selectedProduct.colorCode || '',
            });
            setColors(selectedProduct.colors || ['', '', '']);
            setColourImages(selectedProduct.colourImages || [null, null, null]);
            setHotspots(selectedProduct.hotspots || []);
            setLines(selectedProduct.lines || []);
            setTextBoxes(selectedProduct.textBoxes || []);

            // Reset image states
            setImageFile(null);
            setUploadedImageUrl(null);
            setImagePreview(selectedProduct.imageUrl || null);
            setImage(selectedProduct.imageUrl || null);
        }
    }, [editDialogOpen, selectedProduct]);

    useEffect(() => {
        return () => {
            // Clean up object URLs when component unmounts or dialog closes
            if (imagePreviewUrlRef.current) {
                URL.revokeObjectURL(imagePreviewUrlRef.current);
                imagePreviewUrlRef.current = null;
            }
            if (searchImagePreviewUrlRef.current) {
                URL.revokeObjectURL(searchImagePreviewUrlRef.current);
                searchImagePreviewUrlRef.current = null;
            }
        };
    }, [editDialogOpen]);

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

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            setSnackbarMessage('Failed to load products');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setLoading(false);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditDialogOpen(true);
    };

    const handleEditImageDrop = async (file) => {
        // Revoke previous object URL if any
        if (imagePreviewUrlRef.current) {
            URL.revokeObjectURL(imagePreviewUrlRef.current);
        }

        // Create new object URL for preview
        const localUrl = URL.createObjectURL(file);
        imagePreviewUrlRef.current = localUrl;

        // Update all relevant states
        setImageFile(file);
        setImagePreview(localUrl);
        setUploadedImageUrl(localUrl);
        setImage(localUrl); // This is for the editor view

        // Clear any existing hotspots/lines when changing image
        setHotspots([]);
        setLines([]);
        setTextBoxes([]);
    };

    // Replace the existing handleSearchImageDrop with this:
    const handleSearchImageDrop = (file) => {
        // Revoke previous URL if exists
        if (searchImagePreviewUrlRef.current) {
            URL.revokeObjectURL(searchImagePreviewUrlRef.current);
        }

        const localUrl = URL.createObjectURL(file);
        searchImagePreviewUrlRef.current = localUrl;

        setSearchImageFile(file);
        setSearchImagePreview(localUrl);
        setSnackbarMessage(`Image "${file.name}" uploaded for search`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
    };

    // Add this cleanup function to your useEffect cleanup:
    useEffect(() => {
        return () => {
            if (imagePreviewUrlRef.current) {
                URL.revokeObjectURL(imagePreviewUrlRef.current);
                imagePreviewUrlRef.current = null;
            }
            if (searchImagePreviewUrlRef.current) {
                URL.revokeObjectURL(searchImagePreviewUrlRef.current);
                searchImagePreviewUrlRef.current = null;
            }
        };
    }, [editDialogOpen]);

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

    const handleEditSave = async () => {
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
        if (!selectedProduct || !(selectedProduct._id || selectedProduct.id)) {
            setSnackbarMessage('No product selected for editing.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        setConfirmDialogOpen(true);
    };

    const confirmEditSave = async () => {
        setConfirmDialogOpen(false);
        setEditLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('destination', productDestination);
            formData.append('hotspots', JSON.stringify(hotspots));
            formData.append('lines', JSON.stringify(lines));
            formData.append('textBoxes', JSON.stringify(textBoxes));
            formData.append('price', price);
            formData.append('description', description);

            // Always append the image file if it exists
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const productId = selectedProduct._id || selectedProduct.id;
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update product');

            // Handle parts updates if needed
            if (productDestination.startsWith('Parts Category') && hotspots.length > 0) {
                // Your existing parts update code...
            }

            setSnackbarMessage('Product updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setEditDialogOpen(false);
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage(error.message || 'Error updating product');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setEditLoading(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const scaledWidth = (imageSize.width * zoomLevel) / 100;
    const scaledHeight = (imageSize.height * zoomLevel) / 100;
    const offsetX = (containerSize.width - scaledWidth) / 2;
    const offsetY = (containerSize.height - scaledHeight) / 2;

    const showImageUpload = !productDestination.startsWith('Displacement') &&
        productDestination !== 'Year' &&
        productDestination !== 'Model';

    const filteredProducts = products
        .filter(product => product.destination)
        .filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.destination.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem', mb: 3 }}>
                Edit Product
            </Typography>

            {/* Search Bar */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search product name, description, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                        <IconButton onClick={() => setSearchTerm('')}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )
                }}
            />

            {/* Drag and Drop Area below search bar */}
            <DragAndDropArea
                onFileDrop={handleEditImageDrop}
                imagePreview={imagePreview}
                onCancel={() => {
                    setImageFile(null);
                    setUploadedImageUrl(null);
                    setImagePreview(selectedProduct?.imageUrl || null);
                    setImage(selectedProduct?.imageUrl || null);
                    if (imagePreviewUrlRef.current) {
                        URL.revokeObjectURL(imagePreviewUrlRef.current);
                        imagePreviewUrlRef.current = null;
                    }
                }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : filteredProducts.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">
                        {searchTerm ? 'No products match your search' : 'No products available'}
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product._id || product.id}>
                                    <TableCell>
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.title}
                                                style={{ width: 80, height: 60, objectFit: 'contain' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>
                                        {product.description.length > 50
                                            ? `${product.description.substring(0, 50)}...`
                                            : product.description}
                                    </TableCell>
                                    <TableCell>{product.destination}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditClick(product)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent dividers>
                    {/* Drag and Drop Area inside dialog with preview */}
                    <DragAndDropArea
                        onFileDrop={handleEditImageDrop}
                        imagePreview={imagePreview}
                        onCancel={() => {
                            setImageFile(null);
                            setUploadedImageUrl(null);
                            setImagePreview(selectedProduct?.imageUrl || null);
                            setImage(selectedProduct?.imageUrl || null);
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2, position: 'relative' }}>
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
                                borderRadius: '3px',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#225095' },
                            }}
                            MenuProps={{ PaperProps: { style: { zIndex: 1302 } } }}
                            onClose={() => setProductsMenuOpen(null)}
                        >
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
                                                        backgroundColor: '#bdbdbd',
                                                    }
                                                }}
                                            >
                                                {option.display}
                                            </MenuItem>
                                        ))}
                                    </Box>
                                )}
                            </Box>

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
                                                        backgroundColor: '#bdbdbd',
                                                    }
                                                }}
                                            >
                                                {option.display}
                                            </MenuItem>
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            {/* Other options */}
                            <MenuItem value="Year">Year</MenuItem>
                            <MenuItem value="Model">Model</MenuItem>
                            <MenuItem value="Country">Country</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Price Field */}
                    {(productDestination === 'Year' ||
                        productDestination === 'Model' ||
                        productDestination === 'Country' ||
                        productDestination === 'Brands We Carry'
                    ) ? null : (
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
                                sx={{ mb: 2 }}
                            />
                        )
                    )}

                    {/* Country-specific fields */}
                    {productDestination === 'Country' && (
                        <>
                            <TextField
                                fullWidth
                                label="Displacement"
                                value={additionalFields.displacement}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, displacement: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Year"
                                value={additionalFields.year}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, year: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Model Code"
                                value={additionalFields.modelCode}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, modelCode: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Colour Code"
                                value={additionalFields.colorCode}
                                onChange={(e) => setAdditionalFields({ ...additionalFields, colorCode: e.target.value })}
                                sx={{ mb: 2 }}
                            />

                            {/* Upload Colour Images */}
                            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
                                Upload Colour Images
                            </Typography>
                            {colors.map((color, index) => (
                                <Box key={`colour-${index}`}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 400, fontSize: '1rem', mb: 1 }}>
                                            {index === 0 ? 'Main Colour' : `Colour ${index}`}
                                        </Typography>
                                        {index >= 2 && (
                                            <IconButton
                                                onClick={() => removeColorField(index)}
                                                sx={{ color: '#E21E27' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            border: '2px dashed #ccc',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: colourImages[index] ? 'transparent' : '#fafafa',
                                            minHeight: 150,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            transition: 'min-height 0.2s',
                                            minWidth: 0,
                                            ...(colourImages[index] && { minHeight: 400 }),
                                            position: 'relative'
                                        }}
                                        onDragOver={handleDragOver}
                                        onDrop={e => handleColourImageDrop(e, index)}
                                        onClick={() => document.getElementById(`colour-upload-${index}`).click()}
                                    >
                                        {colourImages[index] ? (
                                            <img
                                                src={colourImages[index]}
                                                alt={index === 0 ? 'Main Colour' : `Colour ${index}`}
                                                style={{
                                                    width: '100%',
                                                    height: '380px',
                                                    objectFit: 'contain',
                                                    margin: '0 auto 8px auto'
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                    <CloudUploadIcon sx={{ fontSize: 60, color: '#225095', mb: 1 }} />
                                                </Box>
                                                <Typography variant="body1" gutterBottom>
                                                    Drag and drop an image here or
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Browse File
                                                </Typography>
                                            </>
                                        )}
                                        <input
                                            id={`colour-upload-${index}`}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleColourImageChange(e, index)}
                                        />
                                    </Paper>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                onClick={addColorField}
                                startIcon={<AddIcon />}
                                sx={{ mb: 4 }}
                            >
                                Add Colour Option
                            </Button>
                        </>
                    )}

                    {/* Editor Controls - Only show when Parts Category is selected */}
                    {productDestination.startsWith('Parts Category') && (
                        <>
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
                                onMouseMove={handleImageMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {image && (
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
                                        {hotspots.map((hotspot) => {
                                            const textBox = textBoxes.find(tb => String(tb.hotspotNumber) === String(hotspot.number));
                                            if (!textBox) return null;
                                            const startX = hotspot.x;
                                            const startY = hotspot.y;
                                            const textBoxWidth = 280;
                                            const textBoxHeight = 80;
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
                                                        zIndex: 0
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
                                        {lines.map((line) => (
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
                                        {currentLine && (
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
                                        {currentLine && (
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
                                )}
                            </Box>

                            {/* Hotspot List */}
                            {hotspots.length > 0 && (
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
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} disabled={editLoading}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained" color="primary" disabled={editLoading}>
                        {editLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

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
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to update this product? This will also update all associated parts.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmEditSave} color="primary">Confirm</Button>
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

export default EditProduct;