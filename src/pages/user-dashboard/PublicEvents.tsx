import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import TicketBookingDialog from '@/components/user-dashboard/TicketBookingDialog';
import {Event} from '@/constants/types';
import {EventState, fetchPublicEvents} from '@/store/slices/eventSlice';
import {AppDispatch} from '@/store/store';
import {Calendar, MapPin, Ticket, Users} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {motion} from 'framer-motion';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';

const PublicEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {events} = useSelector((state: {event: EventState}) => state.event);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPublicEvents());
  }, [dispatch]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='py-8 px-6 min-h-[calc(100vh-64px)] bg-gray-50'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header Section */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold text-gray-900'>
            Discover Amazing Events
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Find and book tickets for the best events happening in your city
          </p>
        </div>

        {/* Search Section */}
        <div className='max-w-md mx-auto'>
          <Input
            type='search'
            placeholder='Search events by name or category...'
            className='w-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Events Grid */}
        <motion.div 
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className='group h-full overflow-hidden hover:shadow-xl transition-shadow duration-300'>
                <CardHeader className='p-0 aspect-[4/3] overflow-hidden'>
                  <div className='relative h-full'>
                    <img
                      src={event.image}
                      alt={event.title}
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                  </div>
                </CardHeader>
                <CardContent className='p-6 space-y-4'>
                  <Badge variant='secondary' className='mb-2'>
                    {event.category}
                  </Badge>
                  <h2 className='text-xl font-bold text-gray-900 line-clamp-2'>
                    {event.title}
                  </h2>
                  <div className='flex items-center gap-4 text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span className='text-sm'>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {event.venue && (
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        <span className='text-sm'>{event.venue.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='px-6 pb-6'>
                  {selectedEvent && (
                    <TicketBookingDialog
                      event={selectedEvent}
                      isOpen={selectedEvent.id === event.id}
                      onClose={() => setSelectedEvent(null)}
                    />
                  )}
                  <Button
                    className='w-full font-semibold shadow-lg hover:shadow-xl transition-shadow'
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Ticket className='h-4 w-4 mr-2' />
                    Book Tickets
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className='text-center py-12'>
            <h3 className='text-xl font-semibold text-gray-600'>
              No events found
            </h3>
            <p className='text-gray-500 mt-2'>
              Try adjusting your search or check back later for new events
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEvents;
