import SignupForm from '@/components/forms/SingupForm';

const Signup = () => {
  return (
    <div className='flex min-h-[calc(100vh-64px)] w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-lg'>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
