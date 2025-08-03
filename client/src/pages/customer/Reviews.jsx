import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Fab, CircularProgress, Switch, FormControlLabel, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState, useEffect } from 'react';
import apiService from '../../services/api';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';
import ReviewActions from '../../components/ReviewActions';

const getStars = (count) => {
  const full = '★'.repeat(count);
  const empty = '☆'.repeat(5 - count);
  return (
    <span style={{ color: '#fbc02d', fontSize: '1.1em' }}>{full}{empty}</span>
  );
};

const Reviews = () => {
  // State for dialogs and forms
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [form, setForm] = useState({ name: '', rating: '', text: '' });
  const [posting, setPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, rating: '', text: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Check if we're in admin mode based on current path
  const isAdminView = window.location.pathname.startsWith('/admin');
  
  // Fetch reviews and summary from backend
  const fetchReviews = async () => {
    try {
      // Use admin endpoint for admin view, public endpoint for customer view
      const endpoint = isAdminView ? 
        '/api/admin/reviews' : 
        '/api/reviews';
      console.log('🚀 Fetching reviews from endpoint:', endpoint);
      console.log('🚀 isAdminView:', isAdminView);
      
      const res = await apiService.get(endpoint);
      const data = await res.json();
      console.log('🚀 Reviews data received:', data);
      console.log('🚀 Number of reviews:', data.length);
      
      setReviews(data);
    } catch (err) {
      console.error('❌ Error fetching reviews:', err);
      setReviews([]);
    }
  };

  const fetchSummary = async () => {
    if (reviews.length === 0) return;
    setLoadingSummary(true);
    try {
      const res = await apiService.get('/api/admin/reviews/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 5000);
    return () => clearInterval(interval);
  }, []);

  // Remove automatic fetching - only fetch when user clicks button
  // useEffect(() => {
  //   fetchSummary();
  // }, [reviews]);

  // Handler for AI insights button
  const handleGetAIInsights = async () => {
    setShowAIInsights(true);
    if (!summary) {
      await fetchSummary();
    }
  };

  // Dialog handlers
  const handleOpen = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setErrorMsg('You must be logged in to add a review.');
      setErrorSnackbar(true);
      return;
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setPosting(false);
      setErrorMsg('Please login to review.');
      setErrorSnackbar(true);
      return;
    }
    try {
      const response = await apiService.post('/api/admin/reviews', {
        rating: Number(form.rating),
        content: form.text,
        email: userEmail,
      });
      // apiService.post already handles response status checking
      setPosting(false);
      setOpen(false);
      setSnackbar(true);
      setForm({ name: '', rating: '', text: '' });
      fetchReviews();
    } catch (err) {
      setPosting(false);
      setErrorMsg(err.message);
      setErrorSnackbar(true);
    }
  };

  // Login state
  const isLoggedIn = !!localStorage.getItem('userEmail');
  
  // Edit review handlers
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';
  
  // Debug logs
  console.log('🔍 Debug Info:');
  console.log('- isAdminView:', isAdminView);
  console.log('- userEmail:', userEmail);
  console.log('- userRole:', userRole);
  console.log('- isAdmin:', isAdmin);
  console.log('- isLoggedIn:', isLoggedIn);

  const handleEditOpen = (review) => {
    setEditForm({ id: review.id, rating: review.rating, text: review.content });
    setEditDialog(true);
  };
  const handleEditClose = () => setEditDialog(false);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.put(`/api/admin/reviews/${editForm.id}`, {
        rating: Number(editForm.rating),
        content: editForm.text,
        email: userEmail,
        role: userRole,
      });
      // apiService.put already handles response status checking
      setEditDialog(false);
      fetchReviews();
    } catch (err) {
      setErrorMsg(err.message);
      setErrorSnackbar(true);
    }
  };

  // Delete review handlers
  const handleDeleteRequest = (id) => {
    setDeleteDialog({ open: true, id });
  };
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, id: null });
  };
  const handleDeleteConfirm = async () => {
    const id = deleteDialog.id;
    setDeleteDialog({ open: false, id: null });
    try {
      const response = await apiService.request(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, role: userRole }),
      });
      // apiService.request already handles response status checking
      setDeleteSuccess(true);
      fetchReviews();
    } catch (err) {
      setErrorMsg(err.message);
      setErrorSnackbar(true);
    }
  };

  // Admin visibility toggle handler
  const handleVisibilityToggle = async (reviewId, currentVisibility) => {
    if (!isAdmin) return;
    
    try {
      const response = await apiService.put(`/api/admin/reviews/${reviewId}`, {
        isVisible: !currentVisibility
      });
      // apiService.put already handles response status checking
      
      // Show success message
      setSnackbar(true);
      fetchReviews();
    } catch (err) {
      setErrorMsg(err.message);
      setErrorSnackbar(true);
    }
  };

  // Close dialog if user logs out while open
  useEffect(() => {
    if (!isLoggedIn && open) {
      setOpen(false);
    }
  }, [isLoggedIn, open]);

  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        paths={[
          { label: 'Home', to: '/' },
          { label: 'Reviews' }
        ]}
      />

      <Typography variant="h4" component="h1" className="page-title" sx={{ mb: 2 }}>
        Customer Reviews
      </Typography>
      <Typography variant="body1" className="body">
        Hear what our customers are saying about our products and service!
      </Typography>

      {/* Reviews Summary Block */}
      {reviews.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            maxWidth: 500,
            mx: 'auto',
            background: '#f9f9f9',
            border: '1.5px solid #bbb',
            borderRadius: 3
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Reviews Summary
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {getStars(Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length))}
          </Box>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {reviews.length} review{reviews.length > 1 ? 's' : ''}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>
              Average: {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} / 5
            </Typography>
          </Box>

          {/* AI Insights Button and Section */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {!showAIInsights ? (
              <Button
                variant="contained"
                onClick={handleGetAIInsights}
                sx={{
                  backgroundColor: '#3f51b5',
                  '&:hover': {
                    backgroundColor: '#303f9f'
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                🤖 Get AI-Powered Insights
              </Button>
            ) : (
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f0f4ff', 
                borderRadius: 2,
                borderLeft: '4px solid #3f51b5',
                textAlign: 'left'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#3f51b5' }}>
                    🤖 AI-Powered Insights
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      setShowAIInsights(false);
                      setSummary(null); // Clear to refresh next time
                    }}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    ✕
                  </Button>
                </Box>
                {loadingSummary ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2, color: '#666' }}>
                      Analyzing reviews...
                    </Typography>
                  </Box>
                ) : summary?.aiAnalysis ? (
                  <Typography variant="body2">
                    {summary.aiAnalysis}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {(() => {
                      if (reviews.length === 0) return 'No reviews to analyze yet.';
                      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                      if (avg >= 4.5) return 'Initial analysis: Customers overwhelmingly love our products and service.';
                      if (avg >= 3.5) return 'Initial analysis: Most customers are happy with their experience.';
                      if (avg >= 2.5) return 'Initial analysis: Reviews are mixed, with both positive and negative feedback.';
                      return 'Initial analysis: Customers have expressed concerns. We are working to improve.';
                    })()}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Star Distribution */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
              Rating Distribution
            </Typography>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ width: 30 }}>{star}★</Typography>
                  <Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}>
                    <Box 
                      sx={{
                        height: 10,
                        width: `${percentage}%`,
                        backgroundColor: star >= 4 ? '#4caf50' : star >= 3 ? '#ffc107' : '#f44336',
                        borderRadius: 5
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ width: 40, textAlign: 'right' }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* Reviews list */}
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        {reviews.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 4, color: '#666' }}>
            No reviews yet. Be the first to share your experience!
          </Typography>
        ) : (
          reviews.map((review, idx) => (
            <Paper 
              key={idx} 
              className="review-card" 
              elevation={0} 
              sx={{ 
                p: 3, 
                width: '100%', 
                maxWidth: 600,
                border: '1.5px solid #bbb', 
                borderRadius: 3, 
                position: 'relative',
                '&:hover': {
                  boxShadow: 1,
                  borderColor: '#999'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  {/* Customer Name */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {review.account ? 
                      `${review.account.firstName} ${review.account.lastName}` : 
                      'Anonymous Customer'
                    }
                  </Typography>
                  
                  {/* Rating and Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStars(review.rating)}
                    <Typography variant="body2" sx={{ ml: 2, color: '#666' }}>
                      {review.rating}/5 stars
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 2, color: '#999' }}>
                      • {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Action Buttons - Show for all reviews when admin is in admin view, or for user's own reviews in customer view */}
                {(isAdminView && isAdmin) || (!isAdminView && isLoggedIn && review.email === userEmail) ? (
                  <Box>
                    <ReviewActions
                      onEdit={() => handleEditOpen(review)}
                      onDelete={() => handleDeleteRequest(review.id)}
                    />
                  </Box>
                ) : null}
              </Box>
              
              {/* Review Content */}
              <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
                {review.content}
              </Typography>
              
              {/* Admin Controls and Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Your Review Indicator */}
                  {review.email === userEmail && (
                    <Chip 
                      label="Your review" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                  
                  {/* Admin Visibility Status */}
                  {isAdminView && isAdmin && (
                    <Chip 
                      icon={review.isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      label={review.isVisible ? 'Visible to Public' : 'Hidden from Public'}
                      size="small"
                      color={review.isVisible ? 'success' : 'warning'}
                      variant="filled"
                    />
                  )}
                </Box>
                
                {/* Admin Visibility Toggle */}
                {isAdminView && isAdmin && (
                  <Button
                    size="small"
                    variant="outlined"
                    color={review.isVisible ? 'warning' : 'success'}
                    startIcon={review.isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    onClick={() => handleVisibilityToggle(review.id, review.isVisible)}
                    sx={{ 
                      minWidth: 'auto',
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    {review.isVisible ? 'Hide' : 'Show'}
                  </Button>
                )}
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Add Review Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpen}
          disabled={!isLoggedIn}
          sx={{
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s'
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
      {!isLoggedIn && (
        <Alert severity="info" sx={{ mt: 2, mb: 2, maxWidth: 400, mx: 'auto' }}>
          Please log in to add a review.
        </Alert>
      )}

      {/* Add Review Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a Review</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography>Rating:</Typography>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  style={{ 
                    cursor: 'pointer', 
                    color: star <= form.rating ? '#fbc02d' : '#ccc', 
                    fontSize: '1.5em',
                    transition: 'color 0.2s'
                  }}
                  onClick={() => setForm({ ...form, rating: star })}
                >
                  ★
                </span>
              ))}
            </Box>
            <TextField
              label="Your Review"
              name="text"
              value={form.text}
              onChange={handleChange}
              multiline
              minRows={4}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={posting}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={posting}
              startIcon={posting ? <CircularProgress size={20} /> : null}
            >
              {posting ? 'Posting...' : 'Post Review'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={editDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Review</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography>Rating:</Typography>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  style={{ 
                    cursor: 'pointer', 
                    color: star <= editForm.rating ? '#fbc02d' : '#ccc', 
                    fontSize: '1.5em',
                    transition: 'color 0.2s'
                  }}
                  onClick={() => setEditForm({ ...editForm, rating: star })}
                >
                  ★
                </span>
              ))}
            </Box>
            <TextField
              label="Review"
              name="text"
              value={editForm.text}
              onChange={handleEditChange}
              multiline
              minRows={4}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review?</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Review added successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbar} autoHideDuration={4000} onClose={() => setErrorSnackbar(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={deleteSuccess} autoHideDuration={3000} onClose={() => setDeleteSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Review deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reviews;