import { type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu className='space-y-2'>
        {items.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <SidebarMenuItem
              className={`group ${
                isActive ? 'bg-white text-dark' : ''
              } hover:bg-white rounded-sm fade hover:text-dark`}
              key={item.title}
            >
              <Link to={item.url}>
                <SidebarMenuButton className='p-4' tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
