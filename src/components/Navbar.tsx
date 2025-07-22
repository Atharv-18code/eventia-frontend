import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from '@/assets/logo.svg';
import {Button} from './ui/button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      handleScroll(sectionId);
    } else {
      navigate('/');
    }
  };

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <div className='navbar bg-white w-full h-[64px] flex justify-between items-center px-14'>
      <Link className='logo cursor-pointer' to={'/'}>
        <img className='h-20' src={logo} alt='Eventura' />
      </Link>
      <ul className='menu max-md:hidden'>
        <NavigationMenu>
          <NavigationMenuList className='flex gap-8'>
            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => handleNavigation('about')}>
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => navigate('/events')}>
                Events
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => handleNavigation('services')}>
                Services
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => handleNavigation('contact')}>
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to='/login'>
                <Button>Login</Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </ul>
    </div>
  );
};

export default Navbar;
