import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import TicketDialog from '@/components/user-dashboard/TicketDialog';
import {EventState, fetchPublicEvents} from '@/store/slices/eventSlice';
import {AppDispatch} from '@/store/store';
import {Ticket} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const PublicEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {events} = useSelector((state: {event: EventState}) => state.event);

  useEffect(() => {
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className='py-4 h-[calc(100vh-64px)]'>
      <h1 className='text-xl font-semibold mb-4 font-poppins text-primary'>
        Upcoming Public Events
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-6'>
        {events.length > 0 &&
          events.map((event) => (
            <Card key={event.id} className='w-[300px] shadow-lg'>
              <CardHeader>
                <img
                  src={event.image}
                  alt={event.title}
                  className='rounded-md w-[250px] h-[300px]'
                />
              </CardHeader>
              <CardContent className='flex flex-col gap-2 justify-center items-center'>
                <h2 className='font-bold text-center'>{event.title}</h2>
                <h3 className='text-dark'>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: '2-digit',
                  })}
                </h3>
              </CardContent>
              <CardFooter>
                <TicketDialog
                  event={selectedEvent}
                  hidden={true}
                  isOpen={selectedEvent?.id === event.id}
                  onClose={() => setSelectedEvent(null)}
                />
                <Button
                  className='w-full'
                  onClick={() => setSelectedEvent(event)}
                >
                  <Ticket />
                  Buy Tickets
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PublicEvents;
