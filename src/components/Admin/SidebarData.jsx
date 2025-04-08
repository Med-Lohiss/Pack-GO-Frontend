import React from 'react';
import { MdOutlineAddBusiness } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { BsBuildingFillAdd } from "react-icons/bs";

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
    title: 'Gestionar sedes',
    path: '/admin/sedes',
    icon: <MdOutlineAddBusiness />,
    cName: 'nav-text'
  },
];
