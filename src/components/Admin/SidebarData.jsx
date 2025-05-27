import React from 'react';
import { IoMdPersonAdd } from "react-icons/io";
import { BsBuildingFillAdd } from "react-icons/bs";
import { MdReport } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export const SidebarData = [
  {
    title: 'Gestionar Empleados',
    path: '/admin/empleados',
    icon: <IoMdPersonAdd />,
    cName: 'nav-text'
  },
  {
    title: 'Gestionar Empresa',
    path: '/admin/empresa',
    icon: <BsBuildingFillAdd />,
    cName: 'nav-text'
  },
  {
    title: 'Gestionar Reportes',
    path: '/admin/reportes',
    icon: <MdReport />,
    cName: 'nav-text'
  },
  {
    title: 'Gestionar Clientes',
    path: '/admin/clientes',
    icon: <FaUsers />,
    cName: 'nav-text'
  },
];
