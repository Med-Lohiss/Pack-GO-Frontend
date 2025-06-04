import React from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("alertShown");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="#" className="menu-bars" onClick={toggleSidebar}>
        <FaBars />
      </Link>
      <h2 className="navbar-title">Panel de Empleado</h2>
      <Link to="/" className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt />
      </Link>
    </div>
  );
};

export default Navbar;
