import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {getEventDetails} from '../store/slices/eventSlice';
import {Badge} from '@/components/ui/badge';
import {formatDate} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Ticket} from 'lucide-react';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const {eventId} = useParams<{eventId: string}>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {eventDetails, loading, error} = useSelector(
    (state: RootState) => state.event
  );

  useEffect(() => {
    if (eventId) {
      dispatch(getEventDetails(eventId));
    }
  }, [dispatch, eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!eventDetails) return <p>Event not found.</p>;

  return (
    <div className='p-16 h-[calc(100vh-64px)] flex gap-16 items-center justify-center w-full'>
      <div className='h-full'>
        <img
          className='rounded-lg w-full h-full object-cover'
          src={eventDetails.image}
          alt={eventDetails.title}
        />
      </div>
      <div className='flex flex-col justify-evenly gap-4 h-full'>
        <h1 className='text-6xl font-black text-primary'>
          Upcoming Public Event
        </h1>
        <h1 className='text-4xl font-semibold'>{eventDetails.title}</h1>
        <p className='text-lg text-dark'>{eventDetails.description}</p>
        <div className='space-x-2'>
          <Badge className='text-sm w-fit font-normal' variant='secondary'>
            {eventDetails.category}
          </Badge>
          <Badge className='text-sm w-fit font-normal'>
            {eventDetails.isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
        <p className='text-sm font-semibold'>
          Date:{' '}
          <span className='font-light'>{formatDate(eventDetails.date)}</span>
        </p>
        <p className='text-sm font-semibold'>
          Organizer:{' '}
          <span className='font-light'>{eventDetails.organizer.name}</span>
        </p>
        {eventDetails.venueId && (
          <p className='text-sm font-semibold'>
            Venue:{' '}
            <span className='font-light'>
              {eventDetails.venue.name}, {eventDetails.venue.location}
            </span>
          </p>
        )}
        <Button
          className='w-fit'
          size='lg'
          onClick={() => {
            navigate(`/login`);
            toast.error('Please login to buy tickets');
          }}
        >
          <Ticket />
          Buy Tickets
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
