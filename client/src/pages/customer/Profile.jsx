import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        paths={[
          { label: 'Home', to: '/' },
          { label: 'Profile' }
        ]}
      />

      <Typography variant="h4" component="h1" className="page-title" sx={{ mb: 2 }}>
        Your Profile
      </Typography>
      <Typography variant="body1" className="body">
        Welcome to your profile dashboard.
      </Typography>

      {/* Button to navigate to Admin */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/admin/home')}
      >
        Go to Admin Page
      </Button>
      <Button 
        variant="contained" 
        color="primary"
        component="a"
        href="/account/login"
        target="_blank"
        rel="noopener noreferrer"
      >
        Login (New Tab)
      </Button>
      {/* Log Out Button */}
      <Button
        variant="outlined"
        color="secondary"
        sx={{ ml: 2 }}
        onClick={() => {
          localStorage.clear();
          window.open('/', '_blank', 'noopener,noreferrer');
        }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Profile;
