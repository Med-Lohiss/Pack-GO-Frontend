import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { SidebarData } from "./SidebarData";
import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar} />}

      <nav className={isOpen ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={toggleSidebar}>
          <li className='navbar-toggle'>
            <Link to="#" className='menu-bars'>
              <AiOutlineClose style={{ color: "#f0fdf4" }} />
            </Link>
          </li>

          {SidebarData.map((item, index) => (
            <li key={index} className="nav-text">
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 0',
                  paddingLeft: '20px' // 👈 aquí está el margen izquierdo
                }}
              >
                {React.cloneElement(item.icon, {
                  style: { color: '#f0fdf4', marginRight: '10px', fontSize: '1.2rem' }
                })}
                <span style={{ color: '#f0fdf4' }}>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
