import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, TextField, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Cart = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [showCouponMessage, setShowCouponMessage] = useState(false);
  const [deleteCartDialog, setDeleteCartDialog] = useState({ open: false, email: '', partId: null});
  const [deleteCartSuccess, setDeleteCartSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  const checkAndUpdateAppliedCoupon = (items) => {
    const hasDiscount = items.some(item => item.discount && item.discount > 0);
    if (hasDiscount) {
      setAppliedCoupon('DISCOUNT123');
    } else {
      setAppliedCoupon('');
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!userEmail) return;
        const response = await axios.get(`${API_BASE}/api/cart/${userEmail}`);
        const fetchedItems = response.data;
        setCartItems(fetchedItems);
        checkAndUpdateAppliedCoupon(fetchedItems);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCartItems();
  }, [userEmail]);

  useEffect(() => {
    if (!appliedCoupon || !userEmail) return;

    const undiscounted = cartItems.filter(item => !item.discount || item.discount === 0);
    if (undiscounted.length === 0) return;

    const applyDiscount = async () => {
      try {
        for (const item of undiscounted) {
          const itemTotal = item.part?.price * item.quantity;
          const discountAmount = itemTotal * 0.10;
          await axios.put(`${API_BASE}/api/cart/${userEmail}/${item.partId}`, {
            quantity: item.quantity,
            discount: discountAmount
          });
        }
        const updated = await axios.get(`${API_BASE}/api/cart/${userEmail}`);
        setCartItems(updated.data);
      } catch (err) {
        console.error('Error applying discount to new items:', err);
      }
    };

    applyDiscount();
  }, [appliedCoupon, userEmail, cartItems]);


  const handleApplyCoupon = async () => {
    if (coupon === 'DISCOUNT123') {
      // Check if discount is already applied
      const hasDiscount = cartItems.some(item => item.discount && item.discount > 0);

      if (hasDiscount) {
        setCouponMessage('Discount is already applied to your cart!');
        setShowCouponMessage(true);
        return;
      }

      try {
        const discountPercentage = 0.10; // 10% discount

        for (const item of cartItems) {
          const itemTotal = item.part?.price * item.quantity;
          const discountAmount = itemTotal * discountPercentage;

          await axios.put(`${API_BASE}/api/cart/${userEmail}/${item.partId}`, {
            quantity: item.quantity,
            discount: discountAmount
          });
        }

        // Refetch cart
        const updated = await axios.get(`${API_BASE}/api/cart/${userEmail}`);
        setCartItems(updated.data);
        setAppliedCoupon(coupon);
        setCoupon('');
        setShowCouponMessage(false); // Hide message when correct coupon is applied
      } catch (err) {
        console.error('Error applying discount:', err);
      }
    } else {
      setCouponMessage('Invalid coupon code');
      setShowCouponMessage(true);
    }
  };

  const handleDeleteClick = (email, partId) => {
    setDeleteCartDialog({ open: true, email, partId });
  };

  const handleDeleteCartCancel = () => {
    setDeleteCartDialog({ open: false, email: '', partId: null });
  };

  const handleDeleteCartConfirm = async () => {
    const { email, partId } = deleteCartDialog;
    setDeleteCartDialog({ open: false, email: '', partId: null });
    
    try {
      await axios.delete(`${API_BASE}/api/cart/${email}/${partId}`);
      setCartItems(prev => {
        const updatedItems = prev.filter(ci => ci.partId !== partId);
        checkAndUpdateAppliedCoupon(updatedItems);
        return updatedItems;
      });
      setDeleteCartSuccess(true);
    } catch (err) {
      setErrorMsg(err.message);
      setErrorSnackbar(true);
    }
  };

  return (
    <Box >
      <Box sx={{ backgroundColor: '#f0f0f0', borderRadius: 2, p: 2, mb: 4 }}>

        {/* Title */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Your Shopping Cart
        </Typography>

        {/* Breadcrumb */}
        <Breadcrumb
          paths={[
            { label: 'Home', to: '/' },
            { label: 'Shopping Cart' }
          ]}
          extraClass="breadcrumb-cart"
        />

        {/* Progress Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Step 1 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: 'red', color: 'white',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              mb: 1
            }}>1</Box>
            <Typography variant="body2">Cart</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, height: 2, backgroundColor: '#ccc' }} />

          {/* Step 2 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#ccc', color: 'white',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              mb: 1
            }}>2</Box>
            <Typography variant="body2">Customer Info</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, height: 2, backgroundColor: '#ccc' }} />

          {/* Step 3 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              backgroundColor: '#ccc', color: 'white',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              mb: 1
            }}>3</Box>
            <Typography variant="body2">Qr Code</Typography>
          </Box>
        </Box>
      </Box>

      {/* Cart Box */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ width: '80%', maxWidth: 1500, borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
          <Box sx={{ backgroundColor: '#ccc', p: 1, display: 'flex' }}>
            <Typography sx={{ flex: 3, fontWeight: 'bold' }}>Product</Typography>
            <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Price</Typography>
            <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Quantity</Typography>
            <Typography sx={{ flex: 1, fontWeight: 'bold' }}>Total</Typography>
          </Box>

          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <img src="/empty-cart.png" alt="Empty Cart" style={{ width: 100, marginBottom: 10 }} />
              <Typography variant="body1" sx={{ color: '#888' }}>
                Cart is empty
              </Typography>
            </Box>
          ) : (
            cartItems.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', p: 2, alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography>
                    {item.part?.partName || 'Part Name'}
                  </Typography>
                  <Button
                    size="small"
                    sx={{ minWidth: 0, padding: 0, ml: 1, color: 'red', pr: 8 }}
                    onClick={() => handleDeleteClick(userEmail, item.partId)}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Box>

                <Typography sx={{ flex: 1 }}>
                  {item.part?.price !== undefined
                    ? `$${Number(item.part.price).toFixed(2)}`
                    : '0.00'}
                </Typography>

                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {/* ...quantity controls unchanged... */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ width: 32, height: 32, minWidth: 32 }}
                    onClick={async () => {
                      if (item.quantity > 1) {
                        const newQuantity = item.quantity - 1;
                        const hasDiscount = item.discount && item.discount > 0;

                        let updateData = {
                          email: item.email,
                          partId: item.partId,
                          quantity: newQuantity
                        };

                        if (hasDiscount) {
                          const itemTotal = item.part?.price * newQuantity;
                          const discountAmount = itemTotal * 0.10;
                          updateData.discount = discountAmount;
                        }

                        await axios.put(`${API_BASE}/api/cart/${userEmail}/${item.partId}`, updateData);

                        setCartItems(prev => {
                          const updatedItems = prev.map(ci =>
                            ci.partId === item.partId && ci.email === item.email
                              ? {
                                ...ci,
                                quantity: newQuantity,
                                discount: hasDiscount ? updateData.discount : ci.discount
                              }
                              : ci
                          );
                          checkAndUpdateAppliedCoupon(updatedItems);
                          return updatedItems;
                        });
                      }
                    }}
                  >−</Button>

                  <Typography>{item.quantity}</Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ width: 32, height: 32, minWidth: 32 }}
                    onClick={async () => {
                      const newQuantity = item.quantity + 1;
                      const hasDiscount = item.discount && item.discount > 0;

                      let updateData = {
                        email: item.email,
                        partId: item.partId,
                        quantity: newQuantity
                      };

                      if (hasDiscount) {
                        const itemTotal = item.part?.price * newQuantity;
                        const discountAmount = itemTotal * 0.10;
                        updateData.discount = discountAmount;
                      }

                      await axios.put(`${API_BASE}/api/cart/${userEmail}/${item.partId}`, updateData);

                      setCartItems(prev => {
                        const updatedItems = prev.map(ci =>
                          ci.partId === item.partId && ci.email === item.email
                            ? {
                              ...ci,
                              quantity: newQuantity,
                              discount: hasDiscount ? updateData.discount : ci.discount
                            }
                            : ci
                        );
                        checkAndUpdateAppliedCoupon(updatedItems);
                        return updatedItems;
                      });
                    }}
                  >+</Button>
                </Box>

                <Typography sx={{ flex: 1 }}>
                  {item.part?.price !== undefined
                    ? `$${(Number(item.part.price) * item.quantity).toFixed(2)}`
                    : '0.00'}
                </Typography>
              </Box>
            ))
          )}

          <Divider />

          {/* Coupon Code */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, width: '40%', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  sx={{ backgroundColor: '#f8f8f8', borderRadius: 1 }}
                />
                <Button variant="contained" sx={{ backgroundColor: 'red' }} onClick={handleApplyCoupon}>
                  APPLY
                </Button>
              </Box>
              {showCouponMessage && (
                <Typography variant="body2" sx={{
                  color: couponMessage.includes('Invalid') ? 'red' : 'orange',
                  fontWeight: 'bold',
                  ml: 1
                }}>
                  {couponMessage}
                </Typography>
              )}
            </Box>

            {appliedCoupon && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold' }}>
                  Code {appliedCoupon} applied (-${cartItems.reduce((total, item) => total + (item.discount || 0), 0).toFixed(2)})
                </Typography>
              </Box>
            )}

            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Subtotal: ${cartItems.reduce((total, item) => {
                const price = item.part?.price || 0;
                return total + item.quantity * price - (item.discount || 0);
              }, 0).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Bottom Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/ourproducts" style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontWeight: 'bold', color: 'black', cursor: 'pointer' }}>
            Continue Shopping &gt;
          </Typography>
        </Link>

        <Box>
          {!userEmail && (
            <Button
              variant="text"
              sx={{ mr: 2, color: 'blue', textTransform: 'none' }}
              onClick={() => navigate('/login')}
            >
              Login to checkout
            </Button>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: userEmail && cartItems.length > 0 ? 'red' : '#999',
              textTransform: 'none'
            }}
            disabled={!userEmail || cartItems.length === 0}
            onClick={() => {
              if (userEmail && cartItems.length > 0) {
                navigate('/customerinfo');
              }
            }}
          >
            CHECKOUT
          </Button>
        </Box>
      </Box>
      {/* Cart Item Delete Dialog */}
      <Dialog open={deleteCartDialog.open} onClose={handleDeleteCartCancel}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this item from your cart?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCartCancel}>Cancel</Button>
          <Button onClick={handleDeleteCartConfirm} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cart Delete Success Snackbar */}
      <Snackbar 
        open={deleteCartSuccess} 
        autoHideDuration={2500} 
        onClose={() => setDeleteCartSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Item removed from cart successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cart;