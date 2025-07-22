import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Venue} from '@/constants/types';
import {createBooking} from '@/store/slices/venueSlice';
import {AppDispatch} from '@/store/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {format} from 'date-fns';
import {Check, ChevronLeft, ChevronRight} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import {z} from 'zod';

const SERVICE_OPTIONS = {
  catering: [
    {id: 'basic', name: 'Basic Catering', price: 1000},
    {id: 'premium', name: 'Premium Catering', price: 2500},
    {id: 'luxury', name: 'Luxury Catering', price: 5000},
  ],
  decoration: [
    {id: 'standard', name: 'Standard Decoration', price: 800},
    {id: 'themed', name: 'Themed Decoration', price: 1500},
    {id: 'premium', name: 'Premium Decoration', price: 3000},
  ],
  photography: [
    {id: 'basic', name: 'Basic Photography', price: 500},
    {id: 'professional', name: 'Professional Photography', price: 1200},
    {id: 'videography', name: 'Videography Package', price: 2500},
  ],
  music: [
    {id: 'dj', name: 'DJ Service', price: 800},
    {id: 'live', name: 'Live Band', price: 2000},
    {id: 'string', name: 'String Quartet', price: 1500},
  ],
};

// Event categories and types
const EVENT_CATEGORIES = [
  {value: 'business', label: 'Business'},
  {value: 'technology', label: 'Technology'},
  {value: 'music', label: 'Music'},
];

const EVENT_TYPES = [
  {value: 'public', label: 'Public'},
  {value: 'private', label: 'Private'},
];

const formSchema = z.object({
  eventName: z.string().min(2, 'Event name must be at least 2 characters'),
  eventDescription: z.string().optional(),
  eventCategory: z.string().min(1, 'Event category is required'),
  eventType: z.string().min(1, 'Event type is required'),
  startDate: z.date({required_error: 'Start date is required'}),
  endDate: z.date({required_error: 'End date is required'}),
  guests: z.number().min(1, 'At least 1 guest required'),
  eventImage: z.instanceof(File).optional(),
  services: z.object({
    catering: z.string().optional(),
    decoration: z.string().optional(),
    photography: z.string().optional(),
    music: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;
type ServiceType = keyof typeof SERVICE_OPTIONS;

interface VenueDialogProps {
  venue: Venue;
  isOpen?: boolean;
  hidden?: boolean;
  onClose: () => void;
}

const VenueDialog: React.FC<VenueDialogProps> = ({
  venue,
  isOpen = false,
  hidden = false,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<
    Record<ServiceType, string>
  >({
    catering: '',
    decoration: '',
    photography: '',
    music: '',
  });
  const [eventImage, setEventImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: '',
      eventCategory: '',
      eventType: '',
      guests: undefined,
      startDate: undefined,
      endDate: undefined,
      services: {
        catering: '',
        decoration: '',
        photography: '',
        music: '',
      },
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (venue?.capacity !== undefined) {
      setValue('guests', venue.capacity, {shouldValidate: true});
    }
  }, [venue, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (step < 4) {
      nextStep();
      return;
    }

    try {
      const formData = new FormData();
      formData.append('eventName', data.eventName);
      formData.append('eventDescription', data.eventDescription || '');
      formData.append('eventCategory', data.eventCategory);
      formData.append('eventType', data.eventType);
      formData.append('startDate', data.startDate.toISOString());
      formData.append('endDate', data.endDate.toISOString());
      formData.append('guests', data.guests.toString());
      if (data.eventImage) {
        formData.append('eventImage', data.eventImage);
      }
      formData.append('services', JSON.stringify(data.services));

      await dispatch(
        createBooking({
          venueId: venue.id,
          bookingData: formData,
        })
      ).unwrap();

      toast.success('Booking confirmed successfully!');
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const validateCurrentStep = async () => {
    if (step === 1) {
      const isValid = await trigger([
        'eventName',
        'eventCategory',
        'eventType',
      ]);
      if (!isValid) {
        toast.error('Please fill in all event details');
      }
      return isValid;
    } else if (step === 2) {
      const isValid = await trigger(['startDate', 'endDate', 'guests']);
      if (!isValid) {
        toast.error('Please select dates and number of guests');
      }
      return isValid;
    }
    return true;
  };

  const nextStep = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const isValid = await validateCurrentStep();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleServiceSelect = (serviceType: ServiceType, optionId: string) => {
    // If clicking the already selected option, deselect it
    if (selectedServices[serviceType] === optionId) {
      setSelectedServices((prev) => ({
        ...prev,
        [serviceType]: '',
      }));
      setValue(`services.${serviceType}`, '');
    } else {
      // Otherwise select the new option
      setSelectedServices((prev) => ({
        ...prev,
        [serviceType]: optionId,
      }));
      setValue(`services.${serviceType}`, optionId);
    }
  };

  const calculateServicePrice = (serviceType: ServiceType) => {
    const selectedOption = selectedServices[serviceType];
    if (!selectedOption) return 0;
    const service = SERVICE_OPTIONS[serviceType].find(
      (opt) => opt.id === selectedOption
    );
    return service?.price || 0;
  };

  const totalServicesPrice = Object.keys(selectedServices).reduce(
    (total, serviceType) => {
      return total + calculateServicePrice(serviceType as ServiceType);
    },
    0
  );

  const calculateVenuePrice = () => {
    if (!formValues.startDate || !formValues.endDate) return 0;
    const days =
      Math.ceil(
        (formValues.startDate.getTime() - formValues.endDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return days * venue?.pricePerDay;
  };

  const totalPrice = calculateVenuePrice() + totalServicesPrice;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild className={`${hidden ? 'hidden' : ''}`}>
        <Button variant='default' size='sm' className='w-full'>
          Book Venue
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[900px] ${
          step < 3 ? 'h-fit' : 'h-[600px]'
        } overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle>Book {venue?.name}</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Enter your event details'}
            {step === 2 && 'Select date and number of guests'}
            {step === 3 && 'Choose additional services'}
            {step === 4 && 'Review your booking'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col h-full'
        >
          <div className='w-full'>
            {/* Step 1: Event Details */}
            {step === 1 && (
              <div className='flex w-full gap-8'>
                <img
                  src={venue?.image}
                  width={300}
                  className='rounded-md shadow-md'
                />
                <div className='space-y-4 w-full flex flex-col justify-between'>
                  <div>
                    <label className='block mb-2 font-medium'>
                      Event Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      {...register('eventName')}
                      className={`w-full p-2 border rounded ${
                        errors.eventName ? 'border-red-500' : ''
                      }`}
                      placeholder='Wedding, Conference, etc.'
                    />
                    {errors.eventName && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.eventName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>
                      Event Description
                    </label>
                    <textarea
                      {...register('eventDescription')}
                      className='w-full p-2 border rounded min-h-[100px]'
                      placeholder='Describe your event...'
                    />
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>
                      Event Type <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      onValueChange={(value) => setValue('eventType', value)}
                      value={formValues.eventType}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.eventType && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.eventType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>
                      Event Category <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setValue('eventCategory', value)
                      }
                      value={formValues.eventCategory}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.eventCategory && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.eventCategory.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date and Guests */}
            {step === 2 && (
              <div className='flex w-full gap-8'>
                <div className='w-[300px]'>
                  <label className='block mb-2 font-medium'>Event Image</label>
                  <div className='border-2 border-dashed h-full rounded-lg p-4 flex flex-col items-center justify-center'>
                    {eventImage ? (
                      <img
                        src={URL.createObjectURL(eventImage)}
                        className='w-full h-auto rounded-md mb-2'
                      />
                    ) : (
                      <div className='text-gray-500 mb-2'>
                        No image selected
                      </div>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          setEventImage(file);
                          setValue('eventImage', file);
                        }
                      }}
                      className='hidden'
                      id='eventImageUpload'
                    />
                    <label
                      htmlFor='eventImageUpload'
                      className='px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200'
                    >
                      {eventImage ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>
                </div>
                <div className='space-y-4 w-full flex flex-col justify-between'>
                  <div>
                    <label className='block mb-2 font-medium'>
                      Number of Guests <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      {...register('guests', {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            if (value > venue?.capacity) {
                              setValue('guests', venue?.capacity, {
                                shouldValidate: true,
                              });
                            } else if (value < 1) {
                              setValue('guests', 1, {shouldValidate: true});
                            }
                          }
                        },
                      })}
                      className={`w-full p-2 border rounded ${
                        errors.guests ? 'border-red-500' : ''
                      }`}
                      min='1'
                      max={venue?.capacity}
                    />
                    {errors.guests && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.guests.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>
                      Start Date <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='date'
                      value={
                        formValues.startDate
                          ? format(formValues.startDate, 'yyyy-MM-dd')
                          : ''
                      }
                      onChange={(e) => {
                        const date = e.target.valueAsDate;
                        if (date) {
                          setValue('startDate', date, {shouldValidate: true});
                          if (formValues.endDate && date > formValues.endDate) {
                            setValue('endDate', date, {shouldValidate: true});
                          }
                        }
                      }}
                      className={`w-full p-2 border rounded ${
                        errors.startDate ? 'border-red-500' : ''
                      }`}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                    {errors.startDate && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block mb-2 font-medium'>
                      End Date <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='date'
                      value={
                        formValues.endDate
                          ? format(formValues.endDate, 'yyyy-MM-dd')
                          : ''
                      }
                      onChange={(e) => {
                        const date = e.target.valueAsDate;
                        if (date) {
                          if (
                            formValues.startDate &&
                            date >= formValues.startDate
                          ) {
                            setValue('endDate', date, {shouldValidate: true});
                          } else if (!formValues.startDate) {
                            setValue('endDate', date, {shouldValidate: true});
                          } else {
                            toast.error('End date must be after start date');
                          }
                        }
                      }}
                      className={`w-full p-2 border rounded ${
                        errors.endDate ? 'border-red-500' : ''
                      }`}
                      min={
                        formValues.startDate
                          ? format(formValues.startDate, 'yyyy-MM-dd')
                          : format(new Date(), 'yyyy-MM-dd')
                      }
                    />
                    {errors.endDate && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <div className='space-y-6'>
                {Object.entries(SERVICE_OPTIONS).map(
                  ([serviceType, options]) => (
                    <div key={serviceType}>
                      <h3 className='font-medium capitalize mb-3'>
                        {serviceType} Options
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {options.map((option) => (
                          <div
                            key={option.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedServices[serviceType as ServiceType] ===
                              option.id
                                ? 'border-primary bg-primary/10'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() =>
                              handleServiceSelect(
                                serviceType as ServiceType,
                                option.id
                              )
                            }
                          >
                            <h4 className='font-medium'>{option.name}</h4>
                            <p className='text-primary font-bold'>
                              ₹{option.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                  <h3 className='font-medium'>Service Summary</h3>
                  {Object.entries(selectedServices)
                    .filter(([, optionId]) => optionId)
                    .map(([serviceType, optionId]) => {
                      const service = SERVICE_OPTIONS[
                        serviceType as ServiceType
                      ].find((opt) => opt.id === optionId);
                      return (
                        <div
                          key={serviceType}
                          className='flex justify-between mt-2'
                        >
                          <span className='capitalize'>{serviceType}:</span>
                          <span className='font-medium'>
                            {service?.name} (₹{service?.price})
                          </span>
                        </div>
                      );
                    })}
                  {Object.values(selectedServices).every((v) => !v) && (
                    <p className='text-muted-foreground text-sm mt-2'>
                      No services selected
                    </p>
                  )}
                  <div className='flex justify-between mt-4 pt-2 border-t font-bold'>
                    <span>Total Services:</span>
                    <span>₹{totalServicesPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Summary */}
            {step === 4 && (
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='font-medium text-lg'>Event Details</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-muted-foreground'>Event Name</p>
                      <p className='font-medium'>{formValues.eventName}</p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Event Category</p>
                      <p className='font-medium'>
                        {
                          EVENT_CATEGORIES.find(
                            (c) => c.value === formValues.eventCategory
                          )?.label
                        }
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Event Type</p>
                      <p className='font-medium'>
                        {
                          EVENT_TYPES.find(
                            (t) => t.value === formValues.eventType
                          )?.label
                        }
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Number of Guests</p>
                      <p className='font-medium'>{formValues.guests}</p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Date Range</p>
                      <p className='font-medium'>
                        {formValues.startDate && formValues.endDate
                          ? `${format(formValues.startDate, 'PP')} - ${format(
                              formValues.endDate,
                              'PP'
                            )}`
                          : 'Not selected'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='font-medium text-lg'>Venue Details</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-muted-foreground'>Venue Name</p>
                      <p className='font-medium'>{venue?.name}</p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Location</p>
                      <p className='font-medium'>{venue?.location}</p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Price Per Day</p>
                      <p className='font-medium'>₹{venue?.pricePerDay}</p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Total Days</p>
                      <p className='font-medium'>
                        {formValues.startDate && formValues.endDate
                          ? Math.ceil(
                              (formValues.startDate.getTime() -
                                formValues.endDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) + 1
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='font-medium text-lg'>Services</h3>
                  {Object.entries(selectedServices)
                    .filter(([, optionId]) => optionId)
                    .map(([serviceType, optionId]) => {
                      const service = SERVICE_OPTIONS[
                        serviceType as ServiceType
                      ].find((opt) => opt.id === optionId);
                      return (
                        <div key={serviceType} className='flex justify-between'>
                          <span className='capitalize'>{serviceType}:</span>
                          <span className='font-medium'>
                            {service?.name} - ₹{service?.price}
                          </span>
                        </div>
                      );
                    })}
                  {Object.values(selectedServices).every((v) => !v) && (
                    <p className='text-muted-foreground text-sm'>
                      No additional services selected
                    </p>
                  )}
                </div>

                <div className='p-4 bg-gray-50 rounded-lg space-y-2'>
                  <div className='flex justify-between'>
                    <span>Venue Cost:</span>
                    <span>₹{calculateVenuePrice()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Services Cost:</span>
                    <span>₹{totalServicesPrice}</span>
                  </div>
                  <div className='flex justify-between font-bold text-lg pt-2 border-t'>
                    <span>Total Cost:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-between mt-6'>
            {step > 1 ? (
              <Button type='button' variant='outline' onClick={prevStep}>
                <ChevronLeft className='mr-2' /> Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <Button
                type='button'
                onClick={(e) => nextStep(e)}
                disabled={
                  (step === 1 &&
                    (!formValues.eventName ||
                      !formValues.eventCategory ||
                      !formValues.eventType)) ||
                  (step === 2 &&
                    (!formValues.startDate ||
                      !formValues.endDate ||
                      !formValues.guests))
                }
              >
                Next <ChevronRight className='ml-2' />
              </Button>
            ) : (
              <Button type='submit' className='gap-2'>
                <Check size={18} /> Confirm Booking
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VenueDialog;
