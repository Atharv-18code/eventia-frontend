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
import {forgotPasswordSchema} from '@/lib/validation';
import {forgotPassword} from '@/store/slices/authSlice';
import {AppDispatch} from '@/store/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {z} from 'zod';

export default function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: {email: string}) {
    dispatch(forgotPassword(values.email))
      .unwrap()
      .then(() => {
        reset();
        navigate('/');
      });
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
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
