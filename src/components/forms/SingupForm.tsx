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
import {registerSchema} from '@/lib/validation';
import {checkExistingUser, signupUser} from '@/store/slices/authSlice';
import {AppDispatch} from '@/store/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {z} from 'zod';
import {useState} from 'react';
import eventCategories from '@/constants/EventCategories';
import {MultiSelect} from '../ui/multi-select';

export default function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors, isSubmitting},
    reset,
    trigger,
    getValues,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      categories: [],
      budgetRange: 0,
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    if (step !== 3) return;

    const formData = {
      name: values.name,
      email: values.email,
      password: values.password,
      preferences: {
        categories: values.categories,
        budgetRange: values.budgetRange,
      },
    };
    dispatch(signupUser(formData))
      .unwrap()
      .then(() => {
        reset();
        navigate('/login');
      })
      .catch(() => {
        setStep(1);
      });
  }

  const handleNext = async () => {
    const fieldsToValidate: (keyof z.infer<typeof registerSchema>)[] =
      step === 1
        ? ['name', 'email']
        : step === 2
        ? ['password', 'confirmPassword']
        : ['categories', 'budgetRange'];

    const valid = await trigger(fieldsToValidate);

    if (valid) {
      if (step === 1) {
        const email = getValues('email');
        dispatch(checkExistingUser({email}))
          .unwrap()
          .then(() => {
            setStep((prevStep) => prevStep + 1);
          });
      } else {
        setStep((prevStep) => prevStep + 1);
      }
    } else {
      toast.error('Please fill required fields before proceeding.');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Signup</CardTitle>
          <CardDescription>
            <h3>
              {step === 1
                ? 'Step 1: Personal Information'
                : step === 2
                ? 'Step 2: Password Setup'
                : 'Step 3: Preferences'}
            </h3>
            <h4 className='text-xs text-primary'>
              {step === 3
                ? 'Preferences can be updated in your profile after login.'
                : ''}
            </h4>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='John Doe'
                    {...register('name', {required: true})}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-xs'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john.doe@example.com'
                    {...register('email', {required: true})}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='********'
                    {...register('password', {required: true})}
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
                    {...register('confirmPassword', {required: true})}
                  />
                  {errors.confirmPassword && (
                    <p className='text-red-500 text-xs'>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='grid gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='budgetRange'>Budget Range (₹)</Label>
                  <Input
                    id='budgetRange'
                    type='number'
                    {...register('budgetRange', {
                      required: 'Budget range is required',
                      valueAsNumber: true,
                      min: {
                        value: 1000,
                        message: 'Enter a budget of at least $1000',
                      },
                    })}
                  />
                  {errors.budgetRange && (
                    <p className='text-red-500 text-xs'>
                      {errors.budgetRange.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='categories'>Event Categories</Label>
                  <Controller
                    name='categories'
                    control={control}
                    render={({field}) => (
                      <MultiSelect
                        options={eventCategories}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder='Select categories'
                        variant='inverted'
                        animation={2}
                        maxCount={2}
                      />
                    )}
                  />
                  {errors.categories && (
                    <p className='text-red-500 text-xs'>
                      {errors.categories.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className='flex justify-between gap-4 mt-4'>
              {step > 1 && (
                <Button
                  type='button'
                  className='w-full'
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Back
                </Button>
              )}
              {step <= 2 ? (
                <Button type='button' className='w-full' onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing up...' : 'Signup'}
                </Button>
              )}
            </div>

            <div className='mt-4 text-center text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='underline'>
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
