import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar">
      <Link to="#" className="menu-bars" onClick={toggleSidebar}>
        <FaBars />
      </Link>
      <h2 className="navbar-title">Panel de Empleado</h2>
      <Link to="/" className="logout-button">
        <FaSignOutAlt />
      </Link>
    </div>
  );
};

export default Navbar;
