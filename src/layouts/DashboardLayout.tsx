import {AppSidebar} from '@/components/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Separator} from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {NavItems} from '@/constants/NavItems';
import {filterSchema} from '@/lib/validation';
import {AuthState} from '@/store/slices/authSlice';
import {searchVenues} from '@/store/slices/venueSlice';
import {AppDispatch} from '@/store/store';
import {zodResolver} from '@hookform/resolvers/zod';
import {format} from 'date-fns';
import {ListFilter, Search} from 'lucide-react';
import {useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Outlet, useLocation} from 'react-router-dom';
import {z} from 'zod';

const DashboardLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const userPreferences = useSelector(
    (state: {auth: AuthState}) =>
      state.auth.user?.preferences || {budgetRange: 50000}
  );

  const navMap = useMemo(() => {
    return [...NavItems.USER, ...NavItems.ADMIN].reduce((acc, item) => {
      acc[item.url] = item.title;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  const breadcrumbTitle = navMap[location.pathname] || 'Dashboard';

  const {register, handleSubmit, reset, setValue, watch} = useForm<
    z.infer<typeof filterSchema>
  >({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      location: '',
      budgetRange: userPreferences.budgetRange,
      capacity: 0,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const onSubmit = (values: z.infer<typeof filterSchema>) => {
    dispatch(
      searchVenues({
        filters: {
          location: values.location,
          budget: values.budgetRange,
          capacity: values.capacity,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        },
        page: 1,
        limit: 10,
      })
    );

    reset();
  };

  return (
    <SidebarProvider className='flex h-screen overflow-hidden'>
      <AppSidebar />
      <SidebarInset>
        <header className='flex shadow-sm h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink>
                    <Link className='font-bold' to={location.pathname}>
                      {breadcrumbTitle}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {location.pathname === '/venues/book' && (
            <form
              className='flex gap-4 mr-4 w-2/4'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='text-sm flex items-center justify-center w-full bg-white rounded-lg border focus-within:ring-1'>
                <Search className='pointer-events-none size-4 select-none opacity-50 mx-2' />
                <Input
                  type='search'
                  placeholder='Enter location'
                  className='pl-2 border-none shadow-none focus-visible:ring-0'
                  {...register('location')}
                  autoComplete='off'
                />
                <Popover>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <ListFilter className='cursor-pointer size-4 select-none opacity-50 mx-2' />
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Apply Filters</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PopoverContent className='w-full'>
                    <div className='grid gap-4 w-full'>
                      <div className='space-y-2'>
                        <h4 className='font-medium leading-none'>
                          Apply Filters
                        </h4>
                      </div>
                      <div className='grid gap-2'>
                        <div className='grid grid-cols-3 items-center gap-4'>
                          <Label htmlFor='budgetRange'>Budget (₹)</Label>
                          <Input
                            id='budgetRange'
                            type='number'
                            className='col-span-2 h-8'
                            {...register('budgetRange', {valueAsNumber: true})}
                          />
                        </div>
                        <div className='grid grid-cols-3 items-center gap-4'>
                          <Label htmlFor='capacity'>Capacity</Label>
                          <Input
                            id='capacity'
                            type='number'
                            className='col-span-2 h-8'
                            {...register('capacity', {valueAsNumber: true})}
                          />
                        </div>
                        <div className='grid grid-cols-3 items-center gap-4'>
                          <Label htmlFor='startDate' className='w-16'>
                            Start Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className='h-8 w-full justify-start text-left font-normal col-span-2'
                              >
                                {format(startDate, 'PPP')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                              <Calendar
                                mode='single'
                                selected={startDate}
                                onSelect={(date) => {
                                  if (date) {
                                    setValue('startDate', date);
                                    if (date > endDate) {
                                      setValue('endDate', date);
                                    }
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className='grid grid-cols-3 items-center gap-4 w-full'>
                          <Label htmlFor='endDate' className='w-16'>
                            End Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={'outline'}
                                className='h-8 w-full justify-start text-left font-normal col-span-2'
                              >
                                {format(endDate, 'PPP')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                              <Calendar
                                mode='single'
                                selected={endDate}
                                onSelect={(date) => {
                                  if (date) {
                                    if (date >= startDate) {
                                      setValue('endDate', date);
                                    }
                                  }
                                }}
                                initialFocus
                                fromDate={startDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button type='submit'>Search</Button>
            </form>
          )}
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0 h-[calc(100vh-64px)] overflow-auto'>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
