import { Button } from '@/components/ui/button';
import { CircleArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-16'>
      <h1 className='font-black text-8xl'>404 - Not Found!</h1>
      <Button
        onClick={() => navigate(-1)}
        className='flex items-center space-x-2'
      >
        <CircleArrowLeft />
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
