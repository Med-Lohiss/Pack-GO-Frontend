import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import "../../styles/Navbar.css";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className='navbar'>
        <Link to='#' className='menu-bars'>
          <FaBars onClick={showSidebar} />
        </Link>
        <h2 className='navbar-title'>Panel de Admin</h2>
        <Link to='/' className='logout-button'>
          <FaSignOutAlt />
        </Link>
      </div>
      <Sidebar isOpen={sidebar} toggleSidebar={showSidebar} />
    </>
  );
};

export default Navbar;
