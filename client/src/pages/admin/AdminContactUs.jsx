import axios from 'axios';
import {Box,Typography,IconButton,Tooltip,CircularProgress,Alert} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState, useEffect } from 'react';

import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

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

const AdminContactUs = () => {
  const [content, setContent] = useState({
    
    rowellAddress: '',
    ubiAddress: '',
    rowellHours: '',
    ubiHours: '',
    locationNote: ''
    });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
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
      fetchData();
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
          { label: 'Home', to: '/' },
          { label: 'Contact Us' }
        ]}
      />

      <Typography variant="h4" className="page-title">
        Our Contact
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', mt:6 }}>
        {/* Rowell Office */}
        <Box sx={{ maxWidth: 400, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Rowell Office
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <a 
              href="https://www.google.com/maps/place/Auto+Machinery+Singapore+Pte+Ltd+(@Rowell+Rd)/@1.3087924,103.8522802,17z/data=!4m15!1m8!3m7!1s0x31da19c795192ca3:0x92def4fa40ca5830!2s41+Rowell+Rd,+Singapore+207992!3b1!8m2!3d1.3087924!4d103.8548551!16s%2Fg%2F11h62y5b8c!3m5!1s0x31da19c794f26495:0xfc90a5a9796e550a!8m2!3d1.308799!4d103.8548522!16s%2Fg%2F1thck8nr?entry=ttu&g_ep=EgoyMDI1MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#1976d2', textDecoration: 'none', '&:hover': {textDecoration: 'underline',}}}
            >
              41 Rowell Road,<br />
              Singapore 207992 <span style={{ color: 'red' }}>📍</span>
            </a>
          </Typography>
          <EditableText isEditing={isEditing} onClick={() => handleTextClick('aboutText')}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Tel: +65 6292 9452
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Operating Hours:
          </Typography>
          <Typography variant="body2">
            Mon - Fri: 09.00 - 18.00 <br />
            Sat: 09.00 - 17.00 <br />
            Closed on Sunday & Public Holiday
          </Typography>
          </EditableText>
        </Box>

        {/* Ubi Office */}
        <Box sx={{ maxWidth: 400, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Ubi Office
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <a 
              href="https://www.google.com/maps/place/Auto+Machinery+Singapore+Pte+Ltd+(@Ubi)/@1.3321476,103.8909234,17z/data=!3m2!4b1!5s0x31da1821c52d4ec7:0xfa5f565888acfd6b!4m6!3m5!1s0x31da1729e7d0a10f:0x7de630ecad598c19!8m2!3d1.3321476!4d103.8957943!16s%2Fg%2F11fsk9cys3?entry=ttu&g_ep=EgoyMDI1MDYxNi4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#1976d2', textDecoration: 'none', '&:hover': {textDecoration: 'underline'}}}
            >
              50 Ubi Ave 3, #01-13, Frontier,<br />
              Singapore 408866 <span style={{ color: 'red' }}>📍</span>
            </a>
          </Typography>
          <EditableText isEditing={isEditing} onClick={() => handleTextClick('aboutText')}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Tel: +65 6749 8051
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Operating Hours:
          </Typography>
          <Typography variant="body2">
            Mon - Fri: 09.00 - 18.00 <br />
            Sat: 09.00 - 17.00 <br />
            Closed on Sunday & Public Holiday
          </Typography>
          </EditableText>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminContactUs;