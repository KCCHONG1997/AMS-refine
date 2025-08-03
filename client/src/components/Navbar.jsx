import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Search as SearchIcon, ShoppingCartOutlined as ShoppingCartIcon, PersonOutline as PersonIcon } from '@mui/icons-material';
import { AppBar, Toolbar, InputBase, IconButton, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

// Move styled components outside of Navbar function
const SearchContainer = styled('div')({
  position: 'relative',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
});

const SearchInput = styled(InputBase)({
  backgroundColor: '#ebebeb',
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
  padding: '5px',
  '&:hover': {
    color: '#e21e27',
    backgroundColor: 'transparent',
  },
});

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Products', path: '/ourproducts' },
    { name: 'Our Partners', path: '/ourpartners' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Reviews', path: '/reviews' }
  ];

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          height: '80px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Toolbar sx={{
          padding: '0 24px',
          position: 'relative'
        }}>
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
              sx={{
                height: 70,
                width: 'auto',
              }}
            />
          </Box>

          <Box sx={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '0 120px'
          }}>
            <form onSubmit={handleSearch}>
              <SearchContainer>
                <SearchInput
                  placeholder="Search by part number, model"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchButton type="submit" aria-label="search">
                  <SearchIcon />
                </SearchButton>
              </SearchContainer>
            </form>
          </Box>

          <Box sx={{
            display: 'flex',
            position: 'absolute',
            right: '24px',
            gap: '8px'
          }}>
            <IconButton component={Link} to="/cart" color="inherit">
              <ShoppingCartIcon sx={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.54)' }} />
            </IconButton>

            <IconButton component={Link} to="/profile" color="inherit">
              <PersonIcon sx={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.54)' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar
        position="static"
        sx={{
          backgroundColor: '#225095',
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
          {navItems.map((item) => (
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
                borderRadius: 0,
                '&:hover': { backgroundColor: '#e21e27' }
              }}
            >
              {item.name}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
