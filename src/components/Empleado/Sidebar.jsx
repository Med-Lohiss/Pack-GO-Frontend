import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { SidebarData } from './SidebarData';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar} />}

      <nav className={isOpen ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <span className="menu-bars" onClick={toggleSidebar}>
              <AiOutlineClose style={{ color: "#f0fdf4" }} /> 
            </span>
          </li>

          {SidebarData.map((item, index) => (
            <li
              key={index}
              className={item.cName}
              onClick={() => {
                const tab = item.path.split('=')[1];
                navigate(`/empleado/dashboard?tab=${tab}`);
                toggleSidebar();
              }}
            >
              <span className="nav-item">
                {React.cloneElement(item.icon, { style: { color: "#f0fdf4", marginRight: "10px" } })}
                <span>{item.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
