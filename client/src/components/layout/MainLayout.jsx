import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../Navbar';
import AdminNavbar from '../AdminNavbar';
import Footer from '../Footer';
import Chatbot from '../Chatbot';
import { ErrorBoundary } from '../common';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAccountPage = location.pathname.startsWith('/account');

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation */}
        {!isAccountPage && (isAdmin ? <AdminNavbar /> : <Navbar />)}
        
        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            py: isAccountPage ? 0 : 3,
            px: isAccountPage ? 0 : 2 
          }}
        >
          {isAccountPage ? (
            children
          ) : (
            <Container maxWidth="xl">
              {children}
            </Container>
          )}
        </Box>
        
        {/* Footer and Chatbot - Customer side only */}
        {!isAccountPage && !isAdmin && (
          <>
            <Footer />
            <Chatbot />
          </>
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default MainLayout;
