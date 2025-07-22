import {Button} from '@/components/ui/button';
import {logoutUser} from '@/store/slices/authSlice';
import {AppDispatch} from '@/store/store';
import {useDispatch} from 'react-redux';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className='h-screen flex flex-col gap-16 justify-center items-center'>
      <h1 className='text-3xl'>Dashboard</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Dashboard;
