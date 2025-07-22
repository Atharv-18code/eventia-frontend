import {FaFacebook, FaTwitter, FaWhatsapp} from 'react-icons/fa';
import {Link} from 'react-router-dom';

const Footer = () => {
  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  return (
    <footer className='h-[250px] bg-primary flex flex-col gap-8 items-center justify-center text-lg'>
      <div className='menu'>
        <ul className='flex gap-8 text-accent'>
          <li
            className='hover:text-slate-300 hover:cursor-pointer'
            onClick={() => handleScroll('hero')}
          >
            Home
          </li>
          <li
            className='hover:text-slate-300 hover:cursor-pointer'
            onClick={() => handleScroll('about')}
          >
            About
          </li>
          <li
            className='hover:text-slate-300 hover:cursor-pointer'
            onClick={() => handleScroll('events')}
          >
            Events
          </li>
          <li
            className='hover:text-slate-300 hover:cursor-pointer'
            onClick={() => handleScroll('services')}
          >
            Services
          </li>
          <li
            className='hover:text-slate-300 hover:cursor-pointer'
            onClick={() => handleScroll('contact')}
          >
            Contact
          </li>
        </ul>
      </div>
      <div className='text-3xl flex gap-8 text-accent '>
        <Link to='#' className='hover:text-slate-300'>
          <FaFacebook />
        </Link>
        <Link to='#' className='hover:text-slate-300'>
          <FaTwitter />
        </Link>
        <Link to='#' className='hover:text-slate-300'>
          <FaWhatsapp />
        </Link>
      </div>
      <p className='text-slate-300'>
        &copy; 2025 <Link to={'/'}>Eventia</Link>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
