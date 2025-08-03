import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const DeleteProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
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
            console.error('Error fetching products:', error);
            setSnackbarMessage('Failed to load products');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setLoading(false);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${selectedProduct.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            setSnackbarMessage('Product deleted successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setConfirmDialogOpen(false);
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error('Error deleting product:', error);
            setSnackbarMessage('Failed to delete product');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

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
                Delete Product
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
                                <TableRow key={product._id}>
                                    <TableCell>
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl ? `${product.imageUrl}?v=${product.updatedAt || Date.now()}` : ''}
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
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteClick(product)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the product "{selectedProduct?.title}"?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DeleteProduct;