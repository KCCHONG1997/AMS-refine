import { Box, Typography } from '@mui/material';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

const About = () => {
  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumb
        paths={[
          { label: 'Home', to: '/' },
          { label: 'About Us' }
        ]}
      />

      <Typography variant="h4" component="h1" className="page-title"sx={{ mb: 2 }}>
        About Us
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6, mt: 6,flexWrap: 'wrap' }}>
        <Box sx={{ flex: '0 0 40%', backgroundColor: '#e0e0e0', p: 4, minWidth: '300px', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            About Us
          </Typography>
          <Typography variant="body1">
            At Auto Machinery Singapore, we believe in keeping vehicles running at their best with reliable, high-performance parts.
            Our commitment to quality, affordability, and customer service has made us a trusted name in Singapore’s automotive parts industry.
          </Typography>
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
          <Typography variant="body1">
            Our mission is to be Singapore’s go-to source for reliable, competitively priced automotive parts. 
            Whether you're performing routine maintenance or a complete overhaul, we are committed to delivering the 
            right parts at the right time without compromising on quality.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default About;
