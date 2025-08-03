import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    Chip
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';

// Import step components
import ProductCategoryDropdown from './ProductCategoryDropdown';
import ProductBasicInfoStep from './ProductBasicInfoStep';
import ProductImageUploadStep from './ProductImageUploadStep';
import ProductPartsEditorStep from './ProductPartsEditorStep';

// Step 1 Component (Category Selection)
const ProductCategoryStep = ({ productDestination, setProductDestination, displacementOptions, partsCategoryOptions, onNext }) => {
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
                    <ProductCategoryDropdown
                        value={productDestination}
                        onChange={setProductDestination}
                        displacementOptions={displacementOptions}
                        partsCategoryOptions={partsCategoryOptions}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            onClick={onNext}
                            variant="contained"
                            disabled={!productDestination}
                            sx={{ 
                                px: 4,
                                backgroundColor: '#225095',
                                '&:hover': {
                                    backgroundColor: '#1e4a87'
                                }
                            }}
                        >
                            Next: Basic Information
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const AddProductWizard = () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    // All form states
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [productDestination, setProductDestination] = useState('');
    const [price, setPrice] = useState('');
    const [colors, setColors] = useState(['', '', '']);
    const [colourImages, setColourImages] = useState([null, null, null]);
    const [additionalFields, setAdditionalFields] = useState({
        displacement: '',
        year: '',
        modelCode: '',
        colorCode: '',
    });

    // Parts editor states
    const [hotspots, setHotspots] = useState([]);
    const [lines, setLines] = useState([]);
    const [textBoxes, setTextBoxes] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(80);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
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
    const [hotspotDialogOpen, setHotspotDialogOpen] = useState(false);
    const [textBoxDialogOpen, setTextBoxDialogOpen] = useState(false);
    const [selectedHotspot, setSelectedHotspot] = useState(null);
    const [selectedTextBox, setSelectedTextBox] = useState(null);

    // Options
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

    // Step configuration
    const steps = [
        { label: 'Category', description: 'Select product type' },
        { label: 'Information', description: 'Basic details' },
        { label: 'Images', description: 'Upload photos' },
        { label: 'Parts Editor', description: 'Add hotspots (optional)' },
        { label: 'Review', description: 'Final check' }
    ];

    // Calculate which steps are applicable
    const getApplicableSteps = () => {
        const applicableSteps = [0, 1]; // Category and Basic Info always included
        
        // Add image step if required
        const showImageUpload = !productDestination.startsWith('Displacement') &&
            productDestination !== 'Year' &&
            productDestination !== 'Model';
        
        if (showImageUpload) {
            applicableSteps.push(2); // Images
        }
        
        // Add parts editor if Parts Category
        if (productDestination.startsWith('Parts Category')) {
            applicableSteps.push(3); // Parts Editor
        }
        
        applicableSteps.push(4); // Review always last
        
        return applicableSteps;
    };

    const applicableSteps = getApplicableSteps();
    const totalSteps = applicableSteps.length;

    // Navigation functions
    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Calculate progress
    const progress = ((currentStep + 1) / totalSteps) * 100;

    // Render current step
    const renderStep = () => {
        const actualStepIndex = applicableSteps[currentStep];
        
        switch (actualStepIndex) {
            case 0: // Category
                return (
                    <ProductCategoryStep
                        productDestination={productDestination}
                        setProductDestination={setProductDestination}
                        displacementOptions={displacementOptions}
                        partsCategoryOptions={partsCategoryOptions}
                        onNext={handleNext}
                    />
                );
            
            case 1: // Basic Information
                return (
                    <ProductBasicInfoStep
                        productDestination={productDestination}
                        title={title}
                        setTitle={setTitle}
                        price={price}
                        setPrice={setPrice}
                        additionalFields={additionalFields}
                        setAdditionalFields={setAdditionalFields}
                        colors={colors}
                        setColors={setColors}
                        displacementOptions={displacementOptions}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            
            case 2: // Images
                return (
                    <ProductImageUploadStep
                        productDestination={productDestination}
                        image={image}
                        setImage={setImage}
                        colors={colors}
                        colourImages={colourImages}
                        setColourImages={setColourImages}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            
            case 3: // Parts Editor
                return (
                    <ProductPartsEditorStep
                        productDestination={productDestination}
                        image={image}
                        hotspots={hotspots}
                        setHotspots={setHotspots}
                        lines={lines}
                        setLines={setLines}
                        textBoxes={textBoxes}
                        setTextBoxes={setTextBoxes}
                        zoomLevel={zoomLevel}
                        setZoomLevel={setZoomLevel}
                        imageSize={imageSize}
                        setImageSize={setImageSize}
                        containerSize={containerSize}
                        setContainerSize={setContainerSize}
                        hotspotData={hotspotData}
                        setHotspotData={setHotspotData}
                        textBoxData={textBoxData}
                        setTextBoxData={setTextBoxData}
                        hotspotDialogOpen={hotspotDialogOpen}
                        setHotspotDialogOpen={setHotspotDialogOpen}
                        textBoxDialogOpen={textBoxDialogOpen}
                        setTextBoxDialogOpen={setTextBoxDialogOpen}
                        selectedHotspot={selectedHotspot}
                        setSelectedHotspot={setSelectedHotspot}
                        selectedTextBox={selectedTextBox}
                        setSelectedTextBox={setSelectedTextBox}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            
            case 4: // Review
                return (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h4" gutterBottom>
                            🎉 Review & Submit
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Review step will be implemented here
                        </Typography>
                    </Box>
                );
            
            default:
                return null;
        }
    };

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
                        Add products to your catalog with our step-by-step wizard
                    </Typography>
                    
                    {/* Progress Bar */}
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Step {currentStep + 1} of {totalSteps}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {Math.round(progress)}% Complete
                            </Typography>
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

            {/* Step Indicator */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Stepper activeStep={currentStep} alternativeLabel>
                    {applicableSteps.map((stepIndex, index) => (
                        <Step key={stepIndex}>
                            <StepLabel>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {steps[stepIndex].label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {steps[stepIndex].description}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            {/* Current Step Content */}
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    {renderStep()}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddProductWizard;
