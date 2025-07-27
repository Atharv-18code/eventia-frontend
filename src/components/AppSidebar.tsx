import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';
import { NavItems } from '@/constants/NavItems';
import { getUser } from '@/store/slices/authSlice';
import * as React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const user = getUser();
  const isCollapsed = useSidebar().state;

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='w-full flex justify-between'>
        <Link
          to={'/'}
          className='flex gap-4 items-center justify-center text-sm bg-white rounded-sm px-4 text-dark'
        >
          {isCollapsed === 'expanded' && (
            <img src={logo} alt='Eventura' className='h-12 w-fit' />
          )}
          {isCollapsed === 'collapsed' && (
            <span className='p-[14px] font-black font-poppins'>E</span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NavItems.USER} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}