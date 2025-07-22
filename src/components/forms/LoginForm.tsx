import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {cn} from '@/lib/utils';
import {loginSchema} from '@/lib/validation';
import {loginUser} from '@/store/slices/authSlice';
import {AppDispatch} from '@/store/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {z} from 'zod';

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: {email: string; password: string}) {
    dispatch(loginUser(values))
      .unwrap()
      .then(() => {
        reset();
      });
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john.doe@example.com'
                  {...register('email')}
                  required
                />
                {errors.email && (
                  <p className='text-red-500 text-xs'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <Link
                    to='/forgot-password'
                    className='ml-auto inline-block text-xs underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='********'
                  {...register('password')}
                  required
                />
                {errors.password && (
                  <p className='text-red-500 text-xs'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link to='/signup' className='underline underline-offset-4'>
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
