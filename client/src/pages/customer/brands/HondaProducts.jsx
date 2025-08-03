import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import '../../../styles/PageLayout.css';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const API_BASE = process.env.REACT_APP_API_BASE_URL;

const ProgressIndicatorButton = styled(Button)(({ theme, active }) => ({
    minWidth: '40px',
    height: '40px',
    borderRadius: '4px 4px 0 0',
    position: 'relative',
    backgroundColor: active ? '#E21E27' : '#D9D9D9',
    color: active ? 'white' : '#6D6D6D',
    fontWeight: 'bold',
    zIndex: 1,
    '&:after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: '-10px',
        width: 0,
        height: 0,
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderTop: active ? '10px solid #E21E27' : '10px solid #D9D9D9',
        zIndex: 1
    },
    '&:hover': {
        backgroundColor: active ? '#E21E27' : '#D9D9D9',
    }
}));

const OptionButton = styled(Button)(({ theme, selected }) => ({
    borderRadius: '20px',
    backgroundColor: selected ? '#E21E27' : '#FBFBFB',
    color: selected ? 'white' : 'black',
    padding: '8px 16px',
    margin: '4px',
    minWidth: '80px',
    fontWeight: selected ? 'bold' : 'normal',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    border: '1px solid rgba(0,0,0,0.1)',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: selected ? '#E21E27' : '#e0e0e0',
    }
}));

const NextButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#225095',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '4px',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#1a407a',
    }
}));

const BackButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'white',
    color: '#225095',
    padding: '8px 24px',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: '1px solid #225095',
    marginRight: '16px',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    }
}));

const NumberButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    width: '32px',
    height: '32px',
    minWidth: '32px',
    borderRadius: '50%',
    backgroundColor: '#E21E27',
    color: 'white',
    fontWeight: 'bold',
    padding: 0,
    '&:hover': {
        backgroundColor: '#C00E17',
    }
}));

const PartItem = styled(Box)(({ theme, selected }) => ({
    display: 'flex',
    flexDirection: 'column',
    border: selected ? '2px solid #E21E27' : '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: selected ? '#FFEBEE' : '#f9f9f9',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
}));

const ModelCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#f9f9f9',
    width: '30%',
    margin: '0 1.5% 16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s ease',
    position: 'relative', // Add this line
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
}));

const ColorOption = styled(Box)(({ theme }) => ({
    width: '30%',
    height: '60px',
    border: '1px solid #a9a9a9',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'pointer',
    '&:hover': {
        borderColor: '#E21E27',
    }
}));

const ViewDiagramButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#225095',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px', // Changed from '4px' to '20px' for rounded corners
    fontWeight: 'bold',
    marginTop: '8px',
    width: '100%',
    '&:hover': {
        backgroundColor: '#1a407a',
    }
}));

const ExpandedColorPopup = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
}));

const PopupContent = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    maxWidth: '80%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: '#666',
    '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
}));

const ProductsPage = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [selectedDisplacement, setSelectedDisplacement] = useState('');
    const [selectedPartsCategory, setSelectedPartsCategory] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [expandedRange, setExpandedRange] = useState(null);
    const [expandedDecade, setExpandedDecade] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPart, setCurrentPart] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [expandedColorImage, setExpandedColorImage] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [posting, setPosting] = useState(false);

    const [productDestination, setProductDestination] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [successSnackbar, setSuccessSnackbar] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const userEmail = localStorage.getItem('userEmail');

    const [engineProducts, setEngineProducts] = useState([]);
    const [frameProducts, setFrameProducts] = useState([]);
    const [selectedFramePart, setSelectedFramePart] = useState('');

    const fetchProductsByCategory = async (category) => {
        try {
            const response = await fetch(`${API_BASE}/api/products?destination=${encodeURIComponent(category)}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();

            if (category === "Parts Category: Engine") {
                setEngineProducts(data);
            } else if (category === "Parts Category: Frame") {
                setFrameProducts(data);
            }
        } catch (err) {
            console.error('Error fetching category products:', err);
        }
    };

    useEffect(() => {
        if (selectedPartsCategory === "Engine" && engineProducts.length === 0) {
            fetchProductsByCategory("Parts Category: Engine");
        } else if (selectedPartsCategory === "Frame" && frameProducts.length === 0) {
            fetchProductsByCategory("Parts Category: Frame");
        }
    }, [selectedPartsCategory]);

    const handleAddToCart = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!userEmail) {
            setErrorMsg('Please log in to add items to cart.');
            setErrorSnackbar(true);
            return;
        }

        setPosting(true);
        try {
            await axios.post(`${API_BASE}/api/cart`, {
                email: userEmail,
                partId: selectedPart.id,
                quantity
            });

            setSuccessSnackbar(true);
        } catch (err) {
            console.error('Add to cart failed:', err);
            setErrorMsg('Failed to add item to cart.');
            setErrorSnackbar(true);
        } finally {
            setPosting(false);
        }
    };

    const partsData = [
        {
            id: 1,
            name: "HEADLIGHT ASSY",
            code: "33100-MLR-D41",
            price: 241.60,
            description: "Complete headlight assembly with housing and wiring"
        },
        {
            id: 2,
            name: "COLLAR",
            code: "33111-MLR-D00",
            price: 162.00,
            description: "Spacer collar for headlight assembly"
        },
        {
            id: 3,
            name: "RUBBER",
            code: "33112-MLR-D00",
            price: 2.43,
            description: "Vibration dampening rubber mount"
        },
        {
            id: 4,
            name: "BOLT-WASHER, 6X25",
            code: "93404-0602508",
            price: 3.05,
            description: "Hex bolt with integrated washer, 6mm diameter, 25mm length"
        }

    ];

    const formatOption = (option) => {
        if (option === 'Electric') return 'Electric';
        return option.toLowerCase();
    };

    const displacementOptions = {
        '~ 124 cc': ['Electric', '25 cc', '50 cc', '54 cc', '55 cc', '60 cc', '63 cc', '65 cc', '70 cc', '75 cc', '80 cc', '85 cc', '89 cc', '90 cc', '96 cc', '100 cc', '110 cc', '123 cc'],
        '125 ~ 349 cc': ['125 cc', '135 cc', '145 cc', '150 cc', '154 cc', '155 cc', '160 cc', '170 cc', '173 cc', '175 cc', '185 cc', '190 cc', '200 cc', '220 cc', '223 cc', '230 cc', '240 cc', '250 cc', '258 cc', '260 cc', '300 cc', '305 cc', '349 cc'],
        '350 ~ 699 cc': ['350 cc', '360 cc', '400 cc', '450 cc', '480 cc', '500 cc', '550 cc', '600 cc', '650 cc'],
        '700 ~ 1099 cc': ['700 cc', '750 cc', '800 cc', '900 cc', '1000 cc'],
        '1100 cc ~': ['1100 cc', '1200 cc', '1300 cc', '1500 cc', '1800 cc']
    };

    const yearOptions = {
        '1970s - 1980s': [1971, 1972, 1973, 1974, 1975, 1976, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989],
        '1990s': [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        '2000s': [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007],
        '2010s': [2013, 2014, 2015, 2016, 2017, 2018, 2019],
        '2020s': [2020, 2021, 2022, 2023, 2024, 2025]
    };

    const modelOptions = [
        'CB', 'CBF', 'CBR', 'CL', 'CR', 'CX',
        'FT', 'GB', 'GL', 'NX', 'REBEL', 'SHADOW',
        'VF', 'VT', 'XBR', 'XL', 'XR'
    ];

    const motorcycleModels = [
        // First row
        {
            name: "NX 400",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB400XAR",
            color: "NHB53 / NH436",
            mainImage: "/models_images/NX/CB400XAR-Singapore(NHB53).png",
            colorOptions: [
                "/models_images/NX/CB400XAR-Singapore(NHB53).png",
                "/models_images/NX/CB400XAR-Singapore(NHA56).png"
            ],
            country: "Singapore",
            flag: "/flags/Singapore.png"
        },
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "R380 / NHB61",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png"
            ],
            country: "Chile",
            flag: "/flags/Chile.png"
        },
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "R380 / NHB61 / NH436",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png",
                "/models_images/NX/CB500XAR-Europe(NH436).png"
            ],
            country: "Europe",
            flag: "/flags/Europe.png"
        },
        // Second row
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "R380 / NHB61 / NH436",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png",
                "/models_images/NX/CB500XAR-Europe(NH436).png"
            ],
            country: "Indonesia",
            flag: "/flags/Indonesia.png"
        },
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "NHB61 / NH436",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png",
                "/models_images/NX/CB500XAR-Europe(NH436).png"
            ],
            country: "Korea",
            flag: "/flags/Korea.png"
        },
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "R380 / NHB61 / NH436",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png",
                "/models_images/NX/CB500XAR-Europe(NH436).png"
            ],
            country: "Malaysia",
            flag: "/flags/Malaysia.png"
        },
        // Third row
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "NHB61 / NH436",
            mainImage: "/models_images/NX/CB400XAR-Singapore(NHB53).png",
            colorOptions: [
                "/models_images/NX/CB400XAR-Singapore(NHB53).png",
                "/models_images/NX/CB400XAR-Singapore(NHA56).png"
            ],
            country: "Philippines",
            flag: "/flags/Philippines.png"
        },
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "R380 / NHB61 / NH436",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png",
                "/models_images/NX/CB500XAR-Europe(NH436).png"
            ],
            country: "Australia",
            flag: "/flags/Australia.png"
        },
        {
            name: "NX 500",
            model: "Honda NX",
            displacement: "500 cc",
            year: "2024",
            modelCode: "CB500XAR",
            color: "NHB61 / NH436",
            mainImage: "/models_images/NX/CB500XAR-Chile(R380).png",
            colorOptions: [
                "/models_images/NX/CB500XAR-Chile(R380).png",
                "/models_images/NX/CB500XAR-Chile(NHB61).png",
                "/models_images/NX/CB500XAR-Europe(NH436).png"
            ],
            country: "Vietnam",
            flag: "/flags/Vietnam.png"
        }
    ];

    const toggleRange = (range) => {
        if (expandedRange === range) {
            setExpandedRange(null);
        } else {
            setExpandedRange(range);
        }
    };

    const toggleDecade = (decade) => {
        if (expandedDecade === decade) {
            setExpandedDecade(null);
        } else {
            setExpandedDecade(decade);
        }
    };

    const handleOptionSelect = (option) => {
        if (activeStep === 1) {
            setSelectedDisplacement(option);
        } else if (activeStep === 2) {
            setSelectedPartsCategory(option);
        } else if (activeStep === 3) {
            setSelectedYear(option);
        } else if (activeStep === 4) {
            setSelectedModel(option);
        }
    };



    const handleBack = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleOpenDialog = (part) => {
        setCurrentPart(part);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const renderSteps = () => {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                mb: 6,
                width: '100%',
                position: 'relative',
            }}>
                {/* Dotted line - modified to be shorter and dotted */}
                <Box sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '200px',  // Adjusted to start after first step
                    right: '200px', // Adjusted to end before last step
                    height: '2px',
                    backgroundImage: 'repeating-linear-gradient(to right, #6D6D6D 0, #6D6D6D 4px, transparent 4px, transparent 8px)',
                    zIndex: 0,
                }} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    width: '100%',
                    alignItems: 'flex-start',
                    gap: '300px' // Add gap between steps
                }}>
                    {[1, 2, 3].map((step) => (
                        <Box
                            key={step}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center', // Align items to the left
                                position: 'relative',
                                flex: '0 0 auto'
                            }}
                        >
                            <ProgressIndicatorButton
                                active={activeStep === step}
                                onClick={() => setActiveStep(step)}
                            >
                                {step}
                            </ProgressIndicatorButton>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 'bold',
                                    color: activeStep === step ? '#E21E27' : '#6D6D6D',
                                    textAlign: 'center', 
                                    mt: '15px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {step === 1 && "Motor Details"}
                                {step === 2 && "Parts Category"}
                                {step === 3 && "View Diagram"}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderCombinedStep = () => {
        // Separate handlers for each selection type
        const handleDisplacementSelect = (option) => {
            setSelectedDisplacement(option);
        };

        const handleYearSelect = (option) => {
            setSelectedYear(option);
        };

        const handleModelSelect = (option) => {
            setSelectedModel(option);
        };

        return (
            <>
                <Typography variant="h5" component="h2" sx={{ mb: 0.5, fontWeight: 'bold', textAlign: 'center' }}>
                    <span style={{ color: '#E21E27' }}>HONDA</span> Motorcycle
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, textAlign: 'center' }}>
                    Select your motorcycle specifications
                </Typography>

                {/* Engine Size Section */}
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'left' }}>
                    1. Select Engine Size (Displacement)
                </Typography>
                <Box sx={{
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    mb: 4
                }}>
                    {Object.keys(displacementOptions).map((range) => (
                        <Box key={range} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0'
                                    }
                                }}
                                onClick={() => toggleRange(range)}
                            >
                                <Typography>Engine Size Range: {range}</Typography>
                                <Typography>{expandedRange === range ? '▲' : '▼'}</Typography>
                            </Box>

                            {expandedRange === range && (
                                <Box sx={{
                                    padding: '16px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}>
                                    {displacementOptions[range].map((option) => (
                                        <OptionButton
                                            key={option}
                                            selected={selectedDisplacement === option}
                                            onClick={() => handleDisplacementSelect(option)}
                                        >
                                            {formatOption(option)}
                                        </OptionButton>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Year Section */}
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'left' }}>
                    2. Select Manufacturing Year
                </Typography>
                <Box sx={{
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    mb: 4
                }}>
                    {Object.keys(yearOptions).map((decade) => (
                        <Box key={decade} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0'
                                    }
                                }}
                                onClick={() => toggleDecade(decade)}
                            >
                                <Typography>Year Range: {decade}</Typography>
                                <Typography>{expandedDecade === decade ? '▲' : '▼'}</Typography>
                            </Box>

                            {expandedDecade === decade && (
                                <Box sx={{
                                    padding: '16px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}>
                                    {yearOptions[decade].map((year) => (
                                        <OptionButton
                                            key={year}
                                            selected={selectedYear === year}
                                            onClick={() => handleYearSelect(year)}
                                        >
                                            {year}
                                        </OptionButton>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Model Section */}
                <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'left' }}>
                    3. Select Model Series
                </Typography>
                <Box sx={{
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    mb: 4,
                    padding: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {modelOptions.map((model) => (
                        <OptionButton
                            key={model}
                            selected={selectedModel === model}
                            onClick={() => handleModelSelect(model)}
                            sx={{ minWidth: '100px', margin: '8px' }}
                        >
                            {model}
                        </OptionButton>
                    ))}
                </Box>
            </>
        );
    };

    const renderPartsCategoryStep = () => {

        // Function to determine destination based on selected part
        const getDestination = (partName) => {
            // Engine parts
            const engineParts = [
                "CYLINDER HEAD COVER", "CYLINDER HEAD", "CAMSHAFT / VALVE", "CAM CHAIN / TENSIONER",
                "RIGHT CRANKCASE COVER", "CLUTCH", "STARTING CLUTCH", "A.C. GENERATOR COVER",
                "GENERATOR", "WATER PUMP", "STARTER MOTOR", "OIL PAN / OIL PUMP", "CRANKCASE",
                "CRANKSHAFT / PISTON", "TRANSMISSION (MAINSHAFT)", "TRANSMISSION (COUNTERSHAFT)",
                "GEARSHIFT DRUM", "THERMOSTAT", "THROTTLE BODY"
            ];

            // Frame parts
            const frameParts = [
                "HEADLIGHT", "METER", "MIRROR", "HANDLE LEVER / SWITCH / CABLE",
                "FRONT BRAKE MASTER CYLINDER", "ABS MODULATOR", "BRAKE PIPE", "HANDLE PIPE / TOP BRIDGE",
                "STEERING STEM", "FRONT FENDER", "FRONT FORK", "FRONT BRAKE CALIPER", "FRONT WHEEL",
                "REAR BRAKE CYLINDER (MASTER)", "REAR BRAKE CALIPER", "REAR WHEEL", "FUEL TANK / FUEL PUMP",
                "SEAT", "REAR COWL", "SIDE COVER", "AIR CLEANER", "AIR INJECTION SOLENOID VALVE",
                "CANISTER", "EXHAUST MUFFLER", "PEDAL", "STEP", "SIDE STAND", "SWINGARM",
                "REAR CUSHION", "REAR FENDER", "WINKER", "TAILLIGHT", "BATTERY", "WIRE HARNESS",
                "IGNITION COIL", "FRAME BODY", "RADIATOR", "UPPER COVER / WINDSCREEN", "MIDDLE COWL",
                "TOOLS", "CAUTION LABEL", "MARK / STRIPE"
            ];

            if (engineParts.includes(partName)) {
                return "Parts Category: Engine";
            } else if (frameParts.includes(partName)) {
                return "Parts Category: Frame";
            }
            return "Parts Category";
        };

        // Update destination when part is selected and fetch products
        const handlePartSelection = (partName) => {
            setSelectedPart(partName);
            const destination = getDestination(partName);
            fetchProductsByCategory(destination);
        };

        return (
            <>
                <Typography variant="h5" component="h2" sx={{ mb: 0.5, fontWeight: 'bold', textAlign: 'center' }}>
                    <span style={{ color: '#E21E27' }}>HONDA</span> Motorcycle
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, textAlign: 'center' }}>
                    Choose the Parts Category of your Motorcycle
                </Typography>

                <Box sx={{
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    mb: 4
                }}>
                    {/* Engine Category */}
                    <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                backgroundColor: '#f5f5f5',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0'
                                }
                            }}
                            onClick={() => setSelectedPartsCategory(selectedPartsCategory === 'Engine' ? '' : 'Engine')}
                        >
                            <Typography>Engine</Typography>
                            <Typography>{selectedPartsCategory === 'Engine' ? '▲' : '▼'}</Typography>
                        </Box>
                        {selectedPartsCategory === 'Engine' && (
                            <>
                                {/* Fetched Products from DB - Engine */}
                                {engineProducts.length > 0 && (
                                    <Box sx={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Available Products</Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            gap: '16px'
                                        }}>
                                            {engineProducts.map((product) => (
                                                <Box
                                                    key={product.id}
                                                    sx={{
                                                        width: '30%',
                                                        border: selectedPart === product.title ? '2px solid #E21E27' : '1px solid #e0e0e0',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedPart === product.title ? '#FFEBEE' : '#fbfbfb',
                                                        transition: 'all 0.3s ease',
                                                        mb: 2,
                                                    }}
                                                    onClick={() => {
                                                        setSelectedPart(product.title);
                                                    }}
                                                >
                                                    <Box sx={{
                                                        padding: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '120px',
                                                        backgroundColor: selectedPart === product.title ? '#FFEBEE' : '#fbfbfb',
                                                    }}>
                                                        <img
                                                            src={`${API_BASE}/uploads/${product.image}`}
                                                            alt={product.title}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{
                                                        borderTop: '1px solid #000000',
                                                        padding: '12px',
                                                        backgroundColor: selectedPart === product.title ? '#FFEBEE' : '#f9f9f9'
                                                    }}>
                                                        <Typography variant="body2" sx={{
                                                            textAlign: 'center',
                                                            fontWeight: '500',
                                                            color: selectedPart === product.title ? '#E21E27' : 'inherit',
                                                        }}>
                                                            {product.title}
                                                        </Typography>
                                                        <ViewDiagramButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedPart(product.title);
                                                                setActiveStep(3);
                                                            }}
                                                            sx={{
                                                                mt: 2,
                                                                backgroundColor: selectedPart === product.title ? '#E21E27' : '#225095',
                                                                '&:hover': {
                                                                    backgroundColor: selectedPart === product.title ? '#C00E17' : '#1a407a',
                                                                }
                                                            }}
                                                        >
                                                            View Diagram
                                                        </ViewDiagramButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Static Engine Parts Grid */}
                                <Box sx={{
                                    padding: '16px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    gap: '16px'
                                }}>
                                    {[
                                        { img: "/parts/engine/Cylinder_Head_Cover.png", name: "CYLINDER HEAD COVER" },
                                        { img: "/parts/engine/Cylinder_Head.png", name: "CYLINDER HEAD" },
                                        { img: "/parts/engine/Camshaft_Valve.png", name: "CAMSHAFT / VALVE" },
                                        { img: "/parts/engine/Cam_Chain_Tensioner.png", name: "CAM CHAIN / TENSIONER" },
                                        { img: "/parts/engine/Right_Crankcase_Cover.png", name: "RIGHT CRANKCASE COVER" },
                                        { img: "/parts/engine/Clutch.png", name: "CLUTCH" },
                                        { img: "/parts/engine/Starting_Clutch.png", name: "STARTING CLUTCH" },
                                        { img: "/parts/engine/AC_Generator_Cover.png", name: "A.C. GENERATOR COVER" },
                                        { img: "/parts/engine/Generator.png", name: "GENERATOR" },
                                        { img: "/parts/engine/Water_Pump.png", name: "WATER PUMP" },
                                        { img: "/parts/engine/Starter_Motor.png", name: "STARTER MOTOR" },
                                        { img: "/parts/engine/Oil_Pan_Oil_Pump.png", name: "OIL PAN / OIL PUMP" },
                                        { img: "/parts/engine/Crankcase.png", name: "CRANKCASE" },
                                        { img: "/parts/engine/Crankshaft_Piston.png", name: "CRANKSHAFT / PISTON" },
                                        { img: "/parts/engine/Transmission_Mainshaft.png", name: "TRANSMISSION (MAINSHAFT)" },
                                        { img: "/parts/engine/Transmission_Countershaft.png", name: "TRANSMISSION (COUNTERSHAFT)" },
                                        { img: "/parts/engine/Gearshift_Drum.png", name: "GEARSHIFT DRUM" },
                                        { img: "/parts/engine/Thermostat.png", name: "THERMOSTAT" },
                                        { img: "/parts/engine/Throttle_Body.png", name: "THROTTLE BODY" }
                                    ].map((part, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: '30%',
                                                border: selectedPart === part.name ? '2px solid #E21E27' : '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                cursor: 'pointer',
                                                backgroundColor: selectedPart === part.name ? '#FFEBEE' : '#fbfbfb',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onClick={() => handlePartSelection(part.name)}
                                        >
                                            <Box sx={{
                                                padding: '8px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '120px',
                                                backgroundColor: selectedPart === part.name ? '#FFEBEE' : '#fbfbfb',
                                            }}>
                                                <img
                                                    src={part.img}
                                                    alt={part.name}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{
                                                borderTop: '1px solid #000000',
                                                padding: '12px',
                                                backgroundColor: selectedPart === part.name ? '#FFEBEE' : '#f9f9f9'
                                            }}>
                                                <Typography variant="body2" sx={{
                                                    textAlign: 'center',
                                                    fontWeight: '500',
                                                    color: selectedPart === part.name ? '#E21E27' : 'inherit',
                                                }}>
                                                    {part.name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Frame Category */}
                    <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                backgroundColor: '#f5f5f5',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0'
                                }
                            }}
                            onClick={() => setSelectedPartsCategory(selectedPartsCategory === 'Frame' ? '' : 'Frame')}
                        >
                            <Typography>Frame</Typography>
                            <Typography>{selectedPartsCategory === 'Frame' ? '▲' : '▼'}</Typography>
                        </Box>

                        {selectedPartsCategory === 'Frame' && (
                            <>
                                {/* Fetched Products from DB - Frame */}
                                {frameProducts.length > 0 && (
                                    <Box sx={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Available Products</Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'space-between',
                                            gap: '16px'
                                        }}>
                                            {frameProducts.map((product) => (
                                                <Box
                                                    key={product.id}
                                                    sx={{
                                                        width: '30%',
                                                        border: selectedPart === product.title ? '2px solid #E21E27' : '1px solid #e0e0e0',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedPart === product.title ? '#FFEBEE' : '#fbfbfb',
                                                        transition: 'all 0.3s ease',
                                                        mb: 2,
                                                    }}
                                                    // Only highlight and set selected DB product for diagram
                                                    onClick={() => {
                                                        setSelectedPart(product.title);
                                                        // setSelectedDbProduct and setSelectedStaticPart are not defined in this file, so remove them
                                                        // If you want to show the selected product in the diagram, use selectedPart or another state
                                                    }}
                                                >
                                                    <Box sx={{
                                                        padding: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '120px',
                                                        backgroundColor: selectedPart === product.title ? '#FFEBEE' : '#fbfbfb',
                                                    }}>
                                                        <img
                                                            src={`${API_BASE}/uploads/${product.image}`}
                                                            alt={product.title}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                objectFit: 'contain'
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{
                                                        borderTop: '1px solid #000000',
                                                        padding: '12px',
                                                        backgroundColor: selectedPart === product.title ? '#FFEBEE' : '#f9f9f9'
                                                    }}>
                                                        <Typography variant="body2" sx={{
                                                            textAlign: 'center',
                                                            fontWeight: '500',
                                                            color: selectedPart === product.title ? '#E21E27' : 'inherit',
                                                        }}>
                                                            {product.title}
                                                        </Typography>
                                                        <ViewDiagramButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedPart(product.title);
                                                                setActiveStep(3);
                                                            }}
                                                            sx={{
                                                                mt: 2,
                                                                backgroundColor: selectedPart === product.title ? '#E21E27' : '#225095',
                                                                '&:hover': {
                                                                    backgroundColor: selectedPart === product.title ? '#C00E17' : '#1a407a',
                                                                }
                                                            }}
                                                        >
                                                            View Diagram
                                                        </ViewDiagramButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Hardcoded frame parts below */}
                                <Box sx={{
                                    padding: '16px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    gap: '16px'
                                }}>
                                    {[
                                        { img: "/parts/frame/Headlight.png", name: "HEADLIGHT" },
                                        { img: "/parts/frame/Meter.png", name: "METER" },
                                        { img: "/parts/frame/Mirror.png", name: "MIRROR" },
                                        { img: "/parts/frame/Handle_Lever_Switch_Cable.png", name: "HANDLE LEVER / SWITCH / CABLE" },
                                        { img: "/parts/frame/Front_Brake_Master_Cylinder.png", name: "FRONT BRAKE MASTER CYLINDER" },
                                        { img: "/parts/frame/ABS_Modulator.png", name: "ABS MODULATOR" },
                                        { img: "/parts/frame/Brake_Pipe.png", name: "BRAKE PIPE" },
                                        { img: "/parts/frame/Handle_Pipe_Top_Bridge.png", name: "HANDLE PIPE / TOP BRIDGE" },
                                        { img: "/parts/frame/Steering_Stem.png", name: "STEERING STEM" },
                                        { img: "/parts/frame/Front_Fender.png", name: "FRONT FENDER" },
                                        { img: "/parts/frame/Front_Fork.png", name: "FRONT FORK" },
                                        { img: "/parts/frame/Front_Brake_Caliper.png", name: "FRONT BRAKE CALIPER" },
                                        { img: "/parts/frame/Front_Wheel.png", name: "FRONT WHEEL" },
                                        { img: "/parts/frame/Rear_Brake_Cylinder_Master.png", name: "REAR BRAKE CYLINDER (MASTER)" },
                                        { img: "/parts/frame/Rear_Brake_Caliper.png", name: "REAR BRAKE CALIPER" },
                                        { img: "/parts/frame/Rear_Wheel.png", name: "REAR WHEEL" },
                                        { img: "/parts/frame/Fuel_Tank_Fuel_Pump.png", name: "FUEL TANK / FUEL PUMP" },
                                        { img: "/parts/frame/Seat.png", name: "SEAT" },
                                        { img: "/parts/frame/Rear_Cowl.png", name: "REAR COWL" },
                                        { img: "/parts/frame/Side_Cover.png", name: "SIDE COVER" },
                                        { img: "/parts/frame/Air_Cleaner.png", name: "AIR CLEANER" },
                                        { img: "/parts/frame/Air_Injection_Solenoid_Valve.png", name: "AIR INJECTION SOLENOID VALVE" },
                                        { img: "/parts/frame/Canister.png", name: "CANISTER" },
                                        { img: "/parts/frame/Exhaust_Muffler.png", name: "EXHAUST MUFFLER" },
                                        { img: "/parts/frame/Pedal.png", name: "PEDAL" },
                                        { img: "/parts/frame/Step.png", name: "STEP" },
                                        { img: "/parts/frame/Side_Stand.png", name: "SIDE STAND" },
                                        { img: "/parts/frame/Swingarm.png", name: "SWINGARM" },
                                        { img: "/parts/frame/Rear_Cushion.png", name: "REAR CUSHION" },
                                        { img: "/parts/frame/Rear_Fender.png", name: "REAR FENDER" },
                                        { img: "/parts/frame/Winker.png", name: "WINKER" },
                                        { img: "/parts/frame/Taillight.png", name: "TAILLIGHT" },
                                        { img: "/parts/frame/Battery.png", name: "BATTERY" },
                                        { img: "/parts/frame/Wire_Harness.png", name: "WIRE HARNESS" },
                                        { img: "/parts/frame/Ignition_Coil.png", name: "IGNITION COIL" },
                                        { img: "/parts/frame/Frame_Body.png", name: "FRAME BODY" },
                                        { img: "/parts/frame/Radiator.png", name: "RADIATOR" },
                                        { img: "/parts/frame/Upper_Cover_Windscreen.png", name: "UPPER COVER / WINDSCREEN" },
                                        { img: "/parts/frame/Middle_Cowl.png", name: "MIDDLE COWL" },
                                        { img: "/parts/frame/Tools.png", name: "TOOLS" },
                                        { img: "/parts/frame/Caution_Label.png", name: "CAUTION LABEL" },
                                        { img: "/parts/frame/Mark_stripe.png", name: "MARK / STRIPE" }
                                    ].map((part, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: '30%',
                                                border: selectedPart === part.name ? '2px solid #E21E27' : '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                cursor: 'pointer',
                                                backgroundColor: selectedPart === part.name ? '#FFEBEE' : '#fbfbfb',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onClick={() => handlePartSelection(part.name)}
                                        >
                                            <Box sx={{
                                                padding: '8px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '120px',
                                                backgroundColor: selectedPart === part.name ? '#FFEBEE' : '#fbfbfb',
                                            }}>
                                                <img
                                                    src={part.img}
                                                    alt={part.name}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{
                                                borderTop: '1px solid #000000',
                                                padding: '12px',
                                                backgroundColor: selectedPart === part.name ? '#FFEBEE' : '#f9f9f9'
                                            }}>
                                                <Typography variant="body2" sx={{
                                                    textAlign: 'center',
                                                    fontWeight: '500',
                                                    color: selectedPart === part.name ? '#E21E27' : 'inherit',
                                                }}>
                                                    {part.name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </>
        );
    };


    // Move this array outside of the JSX to avoid syntax errors
    const buttonAndPopupPositions = [
        { // Button 1
            button: { top: '33.5%', left: '68%' },
            popup: { top: 'calc(33.5% - 60px)', left: 'calc(68% + 120px)' }
        },
        { // Button 2 - first instance
            button: { top: '77%', left: '49.5%' },
            popup: { top: 'calc(77% - 60px)', left: 'calc(49.5% + 120px)' }
        },
        { // Button 2 - second instance
            button: { top: '60%', left: '45%' },
            popup: { top: 'calc(60% - 60px)', left: 'calc(40% + 120px)' }
        },
        { // Button 2 - third instance
            button: { top: '45%', left: '35%' },
            popup: { top: 'calc(45% - 60px)', left: 'calc(35% + 120px)' }
        },
        { // Button 3 - first instance
            button: { top: '14.5%', left: '63%' },
            popup: { top: 'calc(14.5% - 60px)', left: 'calc(63% + 120px)' }
        },
        { // Button 3 - second instance
            button: { top: '20%', left: '60%' },
            popup: { top: 'calc(20% - 60px)', left: 'calc(60% + 120px)' }
        },
        { // Button 3 - third instance
            button: { top: '25%', left: '65%' },
            popup: { top: 'calc(25% - 60px)', left: 'calc(65% + 120px)' }
        },
        { // Button 4 - first instance
            button: { top: '70%', left: '77.5%' },
            popup: { top: 'calc(70% - 60px)', left: 'calc(77.5% + 120px)' }
        },
        { // Button 4 - second instance
            button: { top: '65%', left: '80%' },
            popup: { top: 'calc(65% - 60px)', left: 'calc(80% + 120px)' }
        },
        { // Button 4 - third instance
            button: { top: '60%', left: '75%' },
            popup: { top: 'calc(60% - 60px)', left: 'calc(75% + 120px)' }
        }
    ];

    // Add missing state for DB-driven diagram popup
    const [dbPopupHotspot, setDbPopupHotspot] = React.useState(null);
    const [dbPopupQuantity, setDbPopupQuantity] = React.useState(1);
    const dbPopupRef = React.useRef();

    const renderViewDiagramStep = () => {
        // Defensive: find selected DB product for diagram (Frame/Engine)
        let diagramProduct = null;
        if (selectedPartsCategory === 'Engine' && engineProducts.length > 0) {
            diagramProduct = engineProducts.find(p => p.title === selectedPart && p.image && (p.hotspots || p.textBoxes));
        } else if (selectedPartsCategory === 'Frame' && frameProducts.length > 0) {
            diagramProduct = frameProducts.find(p => p.title === selectedPart && p.image && (p.hotspots || p.textBoxes));
        }

        // Always show the hardcoded headlight diagram and UI
        // ...existing headlight diagram code (as above)...
        // After that, show DB-driven diagram if available
        return (
            <>
                {/* Hardcoded headlight diagram and UI */}
                {/* ...existing code for headlight diagram and popup... */}

                {/* DB-driven interactive diagram */}
                {diagramProduct && diagramProduct.image && (
                    <Box sx={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', mb: 4 }}>
                        <img
                            src={diagramProduct.imageUrl || `${API_BASE}/uploads/${diagramProduct.image}`}
                            alt="Diagram"
                            style={{ width: '100%', height: 'auto', border: '1px solid #a9a9a9', borderRadius: '8px', display: 'block' }}
                        />
                        {/* Hotspots */}
                        {(diagramProduct.hotspots || []).map((hotspot, i) => (
                            <Box
                                key={hotspot.id || i}
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
                                    backgroundColor: hotspot.style?.backgroundColor || '#E21E27',
                                    color: hotspot.style?.color || '#fff',
                                    fontWeight: 'bold',
                                    zIndex: 2,
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    cursor: 'pointer'
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    setDbPopupHotspot(hotspot);
                                    setDbPopupQuantity(1); // Reset quantity when opening popup
                                }}
                            >
                                {hotspot.number}
                            </Box>
                        ))}
                        {/* Popup TextBox and red line */}
                        {dbPopupHotspot && (() => {
                            const tb = (diagramProduct.textBoxes || []).find(tb => String(tb.hotspotNumber) === String(dbPopupHotspot.number));
                            if (!tb) return null;
                            // Defensive: check for undefined x/y
                            const hotspotX = dbPopupHotspot.x ?? 0;
                            const hotspotY = dbPopupHotspot.y ?? 0;
                            const popupX = tb.x ?? 0;
                            const popupY = tb.y ?? 0;

                            // Find the real product id for Add to Cart
                            const productId = diagramProduct.id || tb.productId || tb.id;

                            // Add to Cart handler for popup
                            const handlePopupAddToCart = async () => {
                                if (!userEmail) {
                                    setErrorMsg('Please log in to add items to cart.');
                                    setErrorSnackbar(true);
                                    return;
                                }
                                setPosting(true);
                                try {
                                    const res = await axios.get(`${API_BASE}/api/parts/by-number/${tb.partNumber}`);
                                    const part = res.data;

                                    await axios.post(`${API_BASE}/api/cart`, {
                                        email: userEmail,
                                        partId: part.id,
                                        quantity: dbPopupQuantity,
                                        subPartPrice: tb.price
                                    });
                                    setSuccessSnackbar(true);
                                    setDbPopupHotspot(null); // Optionally close popup
                                } catch (err) {
                                    console.error('Add to cart failed:', err);
                                    setErrorMsg('Failed to add item to cart.');
                                    setErrorSnackbar(true);
                                } finally {
                                    setPosting(false);
                                }
                            };

                            return (
                                <>
                                    {/* Red line from hotspot to textbox */}
                                    <svg
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none',
                                            zIndex: 5
                                        }}
                                    >
                                        <line
                                            x1={`${hotspotX}%`}
                                            y1={`${hotspotY}%`}
                                            x2={`${popupX}%`}
                                            y2={`${popupY}%`}
                                            stroke="#E21E27"
                                            strokeWidth="2.5"
                                        />
                                    </svg>
                                    {/* Popup textbox */}
                                    <Box
                                        ref={dbPopupRef}
                                        sx={{
                                            position: 'absolute',
                                            left: `calc(${popupX}% + 20px)`,
                                            top: `${popupY}%`,
                                            width: '280px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            backgroundColor: '#f9f9f9',
                                            zIndex: 10,
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                            transform: 'translateY(-50%)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem', color: '#000000' }}>{tb.partName}</Typography>
                                            <Box sx={{ cursor: 'pointer', color: '#E21E27', ml: 1 }} onClick={() => setDbPopupHotspot(null)}>
                                                ×
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.9rem', color: '#555' }}>{tb.partNumber}</Typography>
                                        {tb.price && (
                                            <>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem', color: '#E21E27' }}>
                                                    ${tb.price}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.8rem' }}>Unit Price Ind. Tax</Typography>
                                            </>
                                        )}
                                        {/* Quantity selector and Add to Cart */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mt: 2 }}>
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
                                                        setDbPopupQuantity(q => Math.max(1, q - 1));
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
                                                    value={dbPopupQuantity}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        const value = parseInt(e.target.value);
                                                        if (!isNaN(value)) {
                                                            setDbPopupQuantity(Math.max(1, value));
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
                                                        setDbPopupQuantity(q => q + 1);
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
                                            <Box
                                                sx={{
                                                    backgroundImage: 'url("/Add_To_Cart.png")',
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat: 'no-repeat',
                                                    width: '40px',
                                                    height: '40px',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        opacity: 0.8
                                                    }
                                                }}
                                                onClick={handlePopupAddToCart}
                                            />
                                        </Box>
                                    </Box>
                                </>
                            );
                        })()}
                    </Box>
                )}
            </>
        );
    };

    const renderCurrentStep = () => {
        switch (activeStep) {
            case 1:
                return renderCombinedStep();
            case 2:
                return renderPartsCategoryStep();
            case 3:
                return renderViewDiagramStep();
            default:
                return renderCombinedStep();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ pl: 0 }}>
            <div className="breadcrumb" style={{ marginBottom: '55px', marginLeft: '-90px' }}>
                <a href="/">Home</a> &nbsp;&gt;&nbsp;
                <a href="/ourproducts">Our Products</a> &nbsp;&gt;&nbsp;
                <span>Honda</span>
            </div>

            {renderSteps()}

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '950px',
                margin: '0 auto',
                position: 'relative',
                pb: 8
            }}>
                {renderCurrentStep()}

                {activeStep < 3 && (
                    <Box sx={{
                        position: { xs: 'static', sm: 'absolute' },
                        right: { sm: '-20px', md: '-40px', lg: '-60px' },
                        bottom: 0,
                        mt: { xs: 2, sm: 0 },
                        alignSelf: { xs: 'flex-end', sm: 'auto' },
                        px: { xs: 2, sm: 0 },
                        display: 'flex'
                    }}>
                        {activeStep > 1 && (
                            <BackButton onClick={handleBack}>
                                Back
                            </BackButton>
                        )}
                        <NextButton
                            onClick={() => setActiveStep(activeStep + 1)}
                            sx={{ ml: activeStep > 1 ? 2 : 0 }}
                            disabled={activeStep === 1 && (!selectedDisplacement || !selectedYear || !selectedModel)}
                        >
                            Next
                        </NextButton>
                    </Box>
                )}

                {activeStep === 3 && (
                    <Box sx={{
                        position: { xs: 'static', sm: 'absolute' },
                        right: { sm: '-20px', md: '-40px', lg: '-60px' },
                        bottom: 0,
                        mt: { xs: 2, sm: 0 },
                        alignSelf: { xs: 'flex-end', sm: 'auto' },
                        px: { xs: 2, sm: 0 },
                        display: 'flex'
                    }}>
                        <BackButton onClick={handleBack}>
                            Back
                        </BackButton>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={successSnackbar}
                autoHideDuration={2500}
                onClose={() => setSuccessSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Item added to cart successfully!
                </Alert>
            </Snackbar>

            <Snackbar
                open={errorSnackbar}
                autoHideDuration={3500}
                onClose={() => setErrorSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductsPage;