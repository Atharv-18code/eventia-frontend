import {Button} from '@/components/ui/button';
import {formatDate} from '@/lib/utils';
import {useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

const TicketPay = () => {
  const {eventId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {event, ticketSelection} = location.state || {};

  useEffect(() => {
    if (!event || !ticketSelection) {
      navigate(`/event/${eventId}`);
    }
  }, [event, ticketSelection, eventId, navigate]);

  if (!event || !ticketSelection) {
    return null;
  }

  const totalAmount = ticketSelection.reduce(
    (acc: number, ticket: {seatType: string; count: number; price: number}) => {
      return acc + ticket.price * ticket.count;
    },
    0
  );

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex justify-between'>
        <h1 className='text-2xl font-bold mb-4'>Confirm Your Booking</h1>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
      <div className='flex gap-4 border rounded-lg p-4 mb-6 items-center'>
        <img src={event.image} width={150} className='rounded-lg' />
        <div>
          <h2 className='text-xl font-semibold'>{event.title}</h2>
          <p>{event.description}</p>
          <p>
            <span className='font-semibold'>Date:</span>{' '}
            {formatDate(event.date)}
          </p>
          <p>
            <span className='font-semibold'>Venue:</span> {event.venue.name},{' '}
            {event.venue.location}
          </p>
        </div>
      </div>

      <div className='border rounded-lg p-4'>
        <h3 className='text-lg font-semibold mb-2'>Your Tickets:</h3>
        {ticketSelection.map(
          (
            ticket: {seatType: string; count: number; price: number},
            index: number
          ) => (
            <div key={index} className='flex justify-between items-center mb-2'>
              <div>
                <p className='font-semibold'>{ticket.seatType}</p>
                <p className='text-sm'>
                  Price: ₹{ticket.price} x {ticket.count}
                </p>
              </div>
              <p className='font-semibold'>₹{ticket.price * ticket.count}</p>
            </div>
          )
        )}
        <div className='border-t pt-4 mt-4 flex justify-between'>
          <span className='font-semibold'>Total Amount:</span>
          <span className='font-bold text-xl'>₹{totalAmount}</span>
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <Button onClick={() => navigate(`/event/${event.id}/payment`)}>
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default TicketPay;
