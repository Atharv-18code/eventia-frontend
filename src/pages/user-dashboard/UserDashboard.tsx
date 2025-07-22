import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import TicketDialog from '@/components/user-dashboard/TicketDialog';
import {Event} from '@/constants/types';
import {formatDate} from '@/lib/utils';
import {EventState, fetchUpcomingPublicEvents} from '@/store/slices/eventSlice';
import {AppDispatch} from '@/store/store';
import {Ticket} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const UserDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {events} = useSelector((state: {event: EventState}) => state.event);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUpcomingPublicEvents());
  }, [dispatch]);

  useEffect(() => {
    const eventId = localStorage.getItem('redirect');
    if (eventId && events.length > 0) {
      const event = events.find((e) => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
        setIsDialogOpen(true);
      }
    }
  }, [events]);

  const handleBuyTicketsClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className='py-4 h-[calc(100vh-64px)]'>
      <div id='cards'>
        <h1 className='text-xl font-semibold font-poppins mb-4 text-primary'>
          Next 3 Upcoming Events
        </h1>
        <div className='flex flex-wrap gap-6'>
          {events.length > 0 &&
            events.map((event) => (
              <Card key={event.id} className='w-[300px] shadow-lg'>
                <CardContent className='flex gap-6 py-4'>
                  <div>
                    <img
                      src={event.image}
                      alt={event.title}
                      width={100}
                      className='rounded-md'
                    />
                  </div>
                  <div className='flex flex-col gap-2 justify-center'>
                    <h2 className='text-sm font-semibold font-poppins'>
                      {event.title.slice(0, 10) + '...'}
                    </h2>
                    <h3 className='text-dark'>{formatDate(event.date)}</h3>
                    <Button
                      variant='default'
                      size='sm'
                      className='w-full'
                      onClick={() => handleBuyTicketsClick(event)}
                    >
                      <Ticket />
                      Buy Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {selectedEvent !== null && (
        <TicketDialog
          event={selectedEvent}
          isOpen={isDialogOpen}
          isRedirected={true}
          hidden={true}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
