import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  return (
    <>
      {!isLoginPage && (isAdmin ? <AdminNavbar /> : <Navbar />)}

      <div className="p-6">
        <Routes>
          <Route path="/account/login" element={<Login />} />
        </Routes>
      </div>
      
      <div className="p-6 min-h-[calc(100vh-120px)]">  {/* Adjust height as needed */}
        {children}
      </div>
      {!isAdmin && <Footer />}
    </>
  );
};

export default MainLayout;