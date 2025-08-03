import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  PersonOutline as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mainAnchorEl, setMainAnchorEl] = useState(null);
  const [productsAnchorEl, setProductsAnchorEl] = useState(null);

  // Timeout references for delayed closing
  const [mainTimeout, setMainTimeout] = useState(null);
  const [productsTimeout, setProductsTimeout] = useState(null);

  // Main dropdown handlers
  const handleMainOpen = (e) => {
    if (mainTimeout) {
      clearTimeout(mainTimeout);
      setMainTimeout(null);
    }
    setMainAnchorEl(e.currentTarget);
  };

  const handleMainClose = () => {
    const timeout = setTimeout(() => {
      setMainAnchorEl(null);
    }, 100); // Small delay to allow mouse movement to menu
    setMainTimeout(timeout);
  };

  const handleMainMenuEnter = () => {
    if (mainTimeout) {
      clearTimeout(mainTimeout);
      setMainTimeout(null);
    }
  };

  const handleMainMenuLeave = () => {
    setMainAnchorEl(null);
    if (mainTimeout) {
      clearTimeout(mainTimeout);
      setMainTimeout(null);
    }
  };

  // Products dropdown handlers
  const handleProductsOpen = (e) => {
    if (productsTimeout) {
      clearTimeout(productsTimeout);
      setProductsTimeout(null);
    }
    setProductsAnchorEl(e.currentTarget);
  };

  const handleProductsClose = () => {
    const timeout = setTimeout(() => {
      setProductsAnchorEl(null);
    }, 100); // Small delay to allow mouse movement to menu
    setProductsTimeout(timeout);
  };

  const handleProductsMenuEnter = () => {
    if (productsTimeout) {
      clearTimeout(productsTimeout);
      setProductsTimeout(null);
    }
  };

  const handleProductsMenuLeave = () => {
    setProductsAnchorEl(null);
    if (productsTimeout) {
      clearTimeout(productsTimeout);
      setProductsTimeout(null);
    }
  };

  const SearchContainer = styled('div')({
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  });

  const SearchInput = styled(InputBase)({
    backgroundColor: '#eeeeee',
    borderRadius: '20px',
    width: '100%',
    padding: '10px 50px 10px 15px',
    fontSize: '1rem',
    border: '1.5px solid #bdbdbd',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    '&:focus-within': {
      borderColor: '#e0e0e0',
      boxShadow: '0 0 0 1px #bdbdbd',
    },
  });

  const SearchButton = styled(IconButton)({
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
    '&:hover': {
      color: '#e21e27',
      backgroundColor: 'transparent',
    },
  });

  const mainMenuItems = [
    { name: 'Home', path: '/admin/home' },
    { name: 'About Us', path: '/admin/about-us' },
    { name: 'Our Products', path: '/admin/our-products' },
    { name: 'Our Partners', path: '/admin/our-partners' },
    { name: 'Contact Us', path: '/admin/contact-us' }
  ];

  const productMenuItems = [
    { name: 'Add Products', path: '/admin/products/add', icon: <AddIcon /> },
    { name: 'Edit Products', path: '/admin/products/edit/1', icon: <EditIcon /> },
    { name: 'Delete Products', path: '/admin/products/delete/1', icon: <DeleteIcon /> },
    { name: 'Upload PDF', path: '/admin/pdfuploader', icon: <AddIcon /> }
  ];

  const staticTabs = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Reviews', path: '/admin/reviews' }
  ];

  return (
    <>
      {/* Top white navbar */}
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          height: '80px',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#fff'
        }}
      >
        <Toolbar sx={{ padding: '0 24px', position: 'relative' }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              left: '24px',
              textDecoration: 'none'
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ height: 70, width: 'auto' }}
            />
          </Box>

          {/* Search */}
          <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 120px' }}>
            <SearchContainer>
              <SearchInput
                placeholder="Search by part number, model"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
              />
              <SearchButton onClick={() => console.log('Search:', searchQuery)}>
                <SearchIcon />
              </SearchButton>
            </SearchContainer>
          </Box>

          {/* Icons */}
          <Box sx={{ display: 'flex', position: 'absolute', right: '24px', gap: '8px' }}>
            <IconButton component={Link} to="/cart" color="inherit">
              <ShoppingCartIcon />
            </IconButton>
            <IconButton component={Link} to="/profile" color="inherit">
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bottom blue navbar with dropdowns */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#e21e27',
          height: '60px',
          display: 'flex',
          justifyContent: 'center'
        }}
        elevation={0}
      >
        <Toolbar sx={{
          justifyContent: 'center',
          padding: 0,
          minHeight: '60px !important'
        }}>

          {/* Main Dropdown */}
          <Box
            onMouseEnter={handleMainOpen}
            onMouseLeave={handleMainClose}
            sx={{ display: 'inline-block' }}
          >
            <Button
              sx={{
                px: 8,
                py: 2,
                height: '100%',
                fontSize: '1.2rem',
                fontWeight: 'medium',
                textTransform: 'none',
                color: 'white',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#b71c1c',
                }
              }}
            >
              Main
            </Button>

            <Popper
              open={Boolean(mainAnchorEl)}
              anchorEl={mainAnchorEl}
              placement="bottom-start"
              disablePortal
              modifiers={[{ name: 'offset', options: { offset: [0, 0] } }]}
              style={{ zIndex: 1300 }}
            >
              <Paper
                sx={{
                  backgroundColor: '#e21e27',
                  color: 'white',
                  px: 2,
                  py: 1,
                }}
                onMouseEnter={handleMainMenuEnter}
                onMouseLeave={handleMainMenuLeave}
              >
                {mainMenuItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    component={Link}
                    to={item.path}
                    onClick={() => setMainAnchorEl(null)}
                    sx={{ '&:hover': { backgroundColor: '#b71c1c' } }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Paper>
            </Popper>
          </Box>

          {/* Static Tabs */}
          {staticTabs.map((item) => (
            <Button
              key={item.name}
              component={Link}
              to={item.path}
              color="inherit"
              sx={{
                px: 8,
                py: 2,
                height: '100%',
                fontSize: '1.2rem',
                fontWeight: 'medium',
                textTransform: 'none',
                color: 'white',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#b71c1c',
                }
              }}
            >
              {item.name}
            </Button>
          ))}

          {/* Products Dropdown */}
          <Box
            onMouseEnter={handleProductsOpen}
            onMouseLeave={handleProductsClose}
            sx={{ display: 'inline-block' }}
          >
            <Button
              sx={{
                px: 8,
                py: 2,
                height: '100%',
                fontSize: '1.2rem',
                fontWeight: 'medium',
                textTransform: 'none',
                color: 'white',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#b71c1c',
                }
              }}
            >
              Products
            </Button>

            <Menu
              anchorEl={productsAnchorEl}
              open={Boolean(productsAnchorEl)}
              onClose={() => setProductsAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              MenuListProps={{
                sx: {
                  backgroundColor: '#e21e27',
                  color: 'white',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                onMouseEnter: handleProductsMenuEnter,
                onMouseLeave: handleProductsMenuLeave
              }}
            >
              {productMenuItems.map((item) => (
                <MenuItem
                  key={item.name}
                  component={Link}
                  to={item.path}
                  onClick={() => setProductsAnchorEl(null)}
                  sx={{ '&:hover': { backgroundColor: '#b71c1c' } }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>
      </AppBar>
    </>
  );
};


export default Navbar;
