import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Chip,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Divider
} from '@mui/material';
import {
    Category as CategoryIcon,
    Build as BuildIcon,
    DirectionsCar as CarIcon,
    CalendarToday as CalendarIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    ExpandLess,
    ExpandMore,
    Engineering as EngineeringIcon
} from '@mui/icons-material';

const ProductCategoryDropdown = ({ 
    value, 
    onChange, 
    displacementOptions = [], 
    partsCategoryOptions = [] 
}) => {
    const [openSubcategory, setOpenSubcategory] = useState(null);

    const categoryOptions = [
        {
            id: 'brands',
            label: 'Brands We Carry',
            value: 'Brands We Carry',
            icon: <BusinessIcon />,
            description: 'Products from specific manufacturers',
            color: '#2196F3'
        },
        {
            id: 'displacement',
            label: 'Displacement',
            icon: <EngineeringIcon />,
            description: 'Categorize by engine displacement',
            color: '#FF9800',
            hasSubcategories: true,
            subcategories: displacementOptions
        },
        {
            id: 'year',
            label: 'Year',
            value: 'Year',
            icon: <CalendarIcon />,
            description: 'Organize by model year',
            color: '#4CAF50'
        },
        {
            id: 'model',
            label: 'Model',
            value: 'Model',
            icon: <CarIcon />,
            description: 'Specific vehicle models',
            color: '#9C27B0'
        },
        {
            id: 'country',
            label: 'Country',
            value: 'Country',
            icon: <LocationIcon />,
            description: 'Region-specific products',
            color: '#F44336'
        },
        {
            id: 'parts',
            label: 'Parts Category',
            icon: <BuildIcon />,
            description: 'Organize by part type',
            color: '#607D8B',
            hasSubcategories: true,
            subcategories: partsCategoryOptions
        }
    ];

    const handleCategorySelect = (category) => {
        if (category.hasSubcategories) {
            setOpenSubcategory(openSubcategory === category.id ? null : category.id);
        } else {
            onChange(category.value);
            setOpenSubcategory(null);
        }
    };

    const handleSubcategorySelect = (subcategory) => {
        onChange(subcategory.value);
        setOpenSubcategory(null);
    };

    const getSelectedCategory = () => {
        if (!value) return null;
        
        // Check main categories
        const mainCategory = categoryOptions.find(cat => cat.value === value);
        if (mainCategory) return mainCategory;
        
        // Check subcategories
        for (const category of categoryOptions) {
            if (category.subcategories) {
                const subcategory = category.subcategories.find(sub => sub.value === value);
                if (subcategory) {
                    return {
                        ...subcategory,
                        parentLabel: category.label,
                        parentIcon: category.icon,
                        color: category.color
                    };
                }
            }
        }
        
        return null;
    };

    const selectedCategory = getSelectedCategory();

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="product-category-label">Product Category</InputLabel>
                <Select
                    labelId="product-category-label"
                    id="product-category"
                    value={value || ''}
                    label="Product Category"
                    required
                    displayEmpty
                    renderValue={() => {
                        if (!selectedCategory) return '';
                        
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {selectedCategory.parentIcon && (
                                    <Box sx={{ color: selectedCategory.color, display: 'flex' }}>
                                        {selectedCategory.parentIcon}
                                    </Box>
                                )}
                                <Typography variant="body1">
                                    {selectedCategory.parentLabel 
                                        ? `${selectedCategory.parentLabel}: ${selectedCategory.display || selectedCategory.label}`
                                        : selectedCategory.label
                                    }
                                </Typography>
                            </Box>
                        );
                    }}
                    sx={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: selectedCategory?.color || '#ccc',
                            borderWidth: selectedCategory ? 2 : 1,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: selectedCategory?.color || '#225095',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: selectedCategory?.color || '#225095',
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 400,
                                '& .MuiMenuItem-root': {
                                    padding: 0,
                                }
                            }
                        }
                    }}
                >
                    <Paper elevation={0} sx={{ p: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                            Choose a category for your product
                        </Typography>
                        <Divider />
                        
                        <List disablePadding>
                            {categoryOptions.map((category) => (
                                <Box key={category.id}>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => handleCategorySelect(category)}
                                            sx={{
                                                borderRadius: 1,
                                                m: 0.5,
                                                '&:hover': {
                                                    backgroundColor: `${category.color}15`,
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: category.color, minWidth: 40 }}>
                                                {category.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {category.label}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {category.description}
                                                    </Typography>
                                                }
                                            />
                                            {category.hasSubcategories && (
                                                openSubcategory === category.id ? <ExpandLess /> : <ExpandMore />
                                            )}
                                        </ListItemButton>
                                    </ListItem>
                                    
                                    {category.hasSubcategories && (
                                        <Collapse in={openSubcategory === category.id} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {category.subcategories.map((subcategory) => (
                                                    <ListItem key={subcategory.value} disablePadding>
                                                        <ListItemButton
                                                            onClick={() => handleSubcategorySelect(subcategory)}
                                                            sx={{
                                                                pl: 4,
                                                                borderRadius: 1,
                                                                m: 0.5,
                                                                ml: 2,
                                                                backgroundColor: value === subcategory.value ? `${category.color}20` : 'transparent',
                                                                '&:hover': {
                                                                    backgroundColor: `${category.color}15`,
                                                                }
                                                            }}
                                                        >
                                                            <ListItemText
                                                                primary={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="body2">
                                                                            {subcategory.display}
                                                                        </Typography>
                                                                        {value === subcategory.value && (
                                                                            <Chip 
                                                                                size="small" 
                                                                                label="Selected" 
                                                                                color="primary"
                                                                                sx={{ 
                                                                                    height: 20,
                                                                                    backgroundColor: category.color,
                                                                                    color: 'white'
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    )}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Select>
            </FormControl>
            
            {/* Selected Category Info */}
            {selectedCategory && (
                <Box sx={{ mt: 2 }}>
                    <Chip
                        icon={selectedCategory.parentIcon || selectedCategory.icon}
                        label={
                            selectedCategory.parentLabel 
                                ? `${selectedCategory.parentLabel}: ${selectedCategory.display || selectedCategory.label}`
                                : selectedCategory.label
                        }
                        sx={{
                            backgroundColor: `${selectedCategory.color}20`,
                            color: selectedCategory.color,
                            border: `1px solid ${selectedCategory.color}40`,
                            '& .MuiChip-icon': {
                                color: selectedCategory.color
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProductCategoryDropdown;
