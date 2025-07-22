import { useNavigate } from 'react-router-dom';
import {Button} from './ui/button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id='hero' className='h-[calc(100vh-64px)] bg-transparent p-14'>
      <div className='flex flex-col justify-center items-center h-full text-center gap-14'>
        <h2 className='mt-[64px] text-8xl font-black'>
          Welcome to <span className='text-primary'>Eve</span>ntia
        </h2>
        <p className='text-2xl text-dark'>
          Plan your perfect event with ease and elegance.
        </p>
        <Button className='text-lg p-6' onClick={() => navigate('/events')}>
          Explore Events
        </Button>
      </div>
    </section>
  );
};

export default Hero;
