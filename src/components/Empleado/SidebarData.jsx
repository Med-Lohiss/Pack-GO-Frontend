import { FaBriefcase, FaUserFriends, FaCommentDots } from 'react-icons/fa';

export const SidebarData = [
  {
    title: 'Viajes de Empresa',
    path: '/empleado/dashboard?tab=empresa',
    icon: <FaBriefcase />,
    cName: 'nav-text',
  },
  {
    title: 'Viajes de Clientes',
    path: '/empleado/dashboard?tab=clientes',
    icon: <FaUserFriends />,
    cName: 'nav-text',
  },
  {
    title: 'Comentarios',
    path: '/empleado/dashboard?tab=comentarios',
    icon: <FaCommentDots />,
    cName: 'nav-text',
  }
];
