import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {EventState, fetchPublicEvents} from '@/store/slices/eventSlice';
import {AppDispatch} from '@/store/store';
import {useEffect} from 'react';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {events, loading, error} = useSelector(
    (state: {event: EventState}) => state.event
  );

  useEffect(() => {
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  const onBuyTicketsClick = (eventId: string) => {
    localStorage.setItem('redirect', eventId.toString());
    navigate(`/login`);
    toast.error('Please login to buy tickets');
  }

  return (
    <div className='px-14 py-8 min-h-[calc(100vh-64px)]'>
      <h1 className='text-3xl font-black text-center mb-12 text-dark'>
        Upcoming Events
      </h1>

      {loading && (
        <p className='text-center text-gray-500'>Loading events...</p>
      )}
      {error && <p className='text-center text-red-500'>{error}</p>}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-6'>
        {events.length > 0 &&
          events.map((event) => (
            <Card key={event.id} className='w-fit shadow-lg'>
              <CardHeader>
                <img
                  src={event.image}
                  alt={event.title}
                  width={300}
                  className='rounded-md'
                />
              </CardHeader>
              <CardContent className='flex flex-col gap-2 justify-center items-center'>
                <h2 className='font-bold'>{event.title}</h2>
                <h3 className='text-dark'>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  })} 
                </h3>
                <Link
                  className='text-accent-foreground text-xs underline'
                  to={`/event/${event.id}`}
                >
                  More info
                </Link>
              </CardContent>
              <CardFooter>
                <Button
                  variant='default'
                  size='lg'
                  className='w-full'
                  onClick={() => onBuyTicketsClick(event.id)}
                >
                  Buy Tickets
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Events;
