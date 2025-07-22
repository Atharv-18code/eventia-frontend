import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import VenueDialog from '@/components/user-dashboard/VenueDialog';
import {VenueState, fetchVenues} from '@/store/slices/venueSlice';
import {AppDispatch} from '@/store/store';
import {MapPin} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Spinner} from '@/components/ui/spinner'; // Import the Spinner component

const Venues = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {venues, loading} = useSelector(
    (state: {venue: VenueState}) => state.venue
  );

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const [selectedVenue, setSelectedVenue] = useState(null);

  return (
    <div className='py-4 h-[calc(100vh-64px)]'>
      <h1 className='text-xl font-semibold mb-4 font-poppins text-primary'>
        Available Venues
      </h1>

      {loading ? (
        <div className='flex items-center justify-center h-full'>
          <Spinner size='large' />
        </div>
      ) : (
        <div className='flex flex-wrap gap-6'>
          {venues.length > 0 &&
            venues.map((venue) => (
              <Card key={venue.id} className='w-[300px] shadow-lg flex flex-col items-center  '>
                <CardHeader>
                  <img
                    src={venue.image}
                    alt={venue.name}
                    width={250}
                    className='rounded-md'
                  />
                </CardHeader>
                <CardContent className='flex flex-col gap-2 justify-center items-center'>
                  <h2 className='font-bold text-center'>{venue.name}</h2>
                  <h3 className='text-dark'>{venue.location}</h3>
                </CardContent>
                <CardFooter>
                  <VenueDialog
                    venue={selectedVenue}
                    hidden={true}
                    isOpen={selectedVenue?.id === venue.id}
                    onClose={() => setSelectedVenue(null)}
                  />
                  <Button
                    className='w-full'
                    onClick={() => setSelectedVenue(venue)}
                  >
                    <MapPin />
                    Book Venue
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default Venues;
