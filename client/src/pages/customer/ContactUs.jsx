import { Box, Typography } from '@mui/material';
import '../../styles/PageLayout.css';
import Breadcrumb from '../../components/Breadcrumb';

const ContactUs = () => {
  return (
    <Box>

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
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;