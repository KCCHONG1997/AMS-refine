import {Box,Typography,IconButton,Tooltip,CircularProgress,Alert} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check'; 

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const EditableText = ({ children, isEditing, onClick, className, ...props }) => (
  <Box
    onClick={isEditing ? onClick : undefined}
    sx={isEditing ? {
      position: 'relative',
      border: '2px dashed',
      borderColor: 'primary.main',
      borderRadius: 1,
      p: 1,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    } : {}}
    className={className}
    {...props}
  >
    {children}
    {isEditing && (
      <EditIcon 
        sx={{ 
          position: 'absolute', 
          top: 4, 
          right: 4, 
          fontSize: 16,
          color: 'primary.main'
        }} 
      />
    )}
  </Box>
);

const AdminAbout = () => {
  const [content, setContent] = useState({ aboutText: '', missionText:'' });
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/website-content`);
        setContent(response.data);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutContent();
  }, []);

  const toggleEditing = async () => {
    if (isEditing) {
      try {
        await axios.put(`${API_BASE}/api/website-content`, content);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        setError("Failed to save: " + err.message);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleTextClick = (field) => {
    if (isEditing) {
      const newText = prompt('Edit text:', content[field]);
      if (newText !== null) {
        setContent(prev => ({ ...prev, [field]: newText }));
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
    {/* Success message */}
    {saveSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 9999,
            boxShadow: 3
          }}
        >
          Changes saved successfully!
        </Alert>
      )}

      {/* Floating Edit Toggle Button */}
      <Tooltip title={isEditing ? "Save changes" : "Edit content"}>
        <IconButton
          color={isEditing ? "success" : "primary"}
          onClick={toggleEditing}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: isEditing ? 'rgba(46, 125, 50, 0.2)' : 'rgba(25, 118, 210, 0.2)',
            '&:hover': {
              backgroundColor: isEditing ? 'rgba(46, 125, 50, 0.3)' : 'rgba(25, 118, 210, 0.3)',
            }
          }}
        >
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>

      {/* Breadcrumb navigation */}
      <Breadcrumb
        paths={[
          { label: 'Home', to: '/admin/home' },
          { label: 'About Us' }
        ]}
      />

      <Typography variant="h4" component="h1" className="page-title"sx={{ mb: 2 }}>
        About Us
      </Typography>

      {/* About Us Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6, mt: 6,flexWrap: 'wrap' }}>
        <Box sx={{ flex: '0 0 40%', backgroundColor: '#e0e0e0', p: 4, minWidth: '300px', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            About Us
          </Typography>
          <EditableText isEditing={isEditing} onClick={() => handleTextClick('aboutText')}>
          <Typography variant="body1">
            {content.aboutText || "No about text available."}
          </Typography>
          </EditableText>
        </Box>

        <Box sx={{ flex: '0 0 40%', textAlign: 'center', minWidth: '300px', mt: { xs: 2, sm: 0 } }}>
          <img 
            src="/aboutus-image-1.png" 
            alt="About Us" 
            style={{ maxWidth: '90%', height: 'auto', maxHeight: '320px' }} 
          />
        </Box>
      </Box>

      {/* Our Mission Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Box sx={{ flex: '0 0 40%', textAlign: 'center', minWidth: '300px', mb: { xs: 2, sm: 0 } }}>
          <img 
            src="/aboutus-image-2.png" 
            alt="Our Mission" 
            style={{ maxWidth: '90%', height: 'auto', maxHeight: '320px' }} 
          />
        </Box>

        <Box sx={{ flex: '0 0 40%', backgroundColor: '#e0e0e0', p: 4, minWidth: '300px', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Our Mission
          </Typography>
          <EditableText isEditing={isEditing} onClick={() => handleTextClick('missionText')}>
            <Typography variant="body1">
              {content.missionText || "No mission text available."}
            </Typography>
          </EditableText>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminAbout;
