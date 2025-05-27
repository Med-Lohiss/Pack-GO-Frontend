import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { SidebarData } from "./SidebarData";


const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <nav className={isOpen ? 'nav-menu active' : 'nav-menu'}>
      <ul className='nav-menu-items' onClick={toggleSidebar}>
        <li className='navbar-toggle'>
          <Link to='#' className='menu-bars'>
            <AiOutlineClose />
          </Link>
        </li>
        {SidebarData.map((item, index) => (
          <li key={index} className='nav-text'>
            <Link to={item.path}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;