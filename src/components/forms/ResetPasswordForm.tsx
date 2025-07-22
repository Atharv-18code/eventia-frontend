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
import {resetPasswordSchema} from '@/lib/validation';
import {resetPassword} from '@/store/slices/authSlice';
import {AppDispatch} from '@/store/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {z} from 'zod';

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: {password: string; confirmPassword: string}) {
    if (values.password !== values.confirmPassword) {
      toast.error('Password does not match.');
    } else {
      const formData = {
        token,
        newPassword: values.password,
      };
      dispatch(resetPassword(formData))
        .unwrap()
        .then(() => {
          navigate('/login');
          reset();
        });
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
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
              <div className='grid gap-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='********'
                  {...register('confirmPassword')}
                  required
                />
                {errors.confirmPassword && (
                  <p className='text-red-500 text-xs'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
