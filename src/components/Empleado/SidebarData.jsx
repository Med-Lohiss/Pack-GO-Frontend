import React from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';

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
  }
];
