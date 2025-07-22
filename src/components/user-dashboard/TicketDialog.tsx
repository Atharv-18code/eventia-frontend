import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Event, TicketPrice} from '@/constants/types';
import {formatDate} from '@/lib/utils';
import {Ticket} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

interface TicketDialogProps {
  event: Event;
  isOpen?: boolean;
  isRedirected?: boolean;
  hidden?: boolean;
  onClose?: () => void;
}

const TicketDialog: React.FC<TicketDialogProps> = ({
  event,
  isRedirected = false,
  isOpen = false,
  hidden = false,
  onClose,
}) => {
  const [ticketSelection, setTicketSelection] = useState<{
    [key: string]: number;
  }>({});

  const navigate = useNavigate();

  const handleSeatSelection = (
    seatType: string,
    availableSeats: number,
    value: number
  ) => {
    const quantity = Math.min(value, availableSeats);
    setTicketSelection((prev) => ({
      ...prev,
      [seatType]: quantity,
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        if (isRedirected) {
          localStorage.removeItem('redirect');
        }
      }}
    >
      <DialogTrigger asChild className={`${hidden ? 'hidden' : ''}`}>
        <Button variant='default' size='sm' className='w-full'>
          <Ticket />
          Buy Tickets
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[1225px] h-[550px]'>
        <DialogHeader>
          <DialogTitle>Book Ticket</DialogTitle>
          <DialogDescription>
            Book your ticket now for this amazing event and have a great time.
          </DialogDescription>
        </DialogHeader>
        <div className='flex font-poppins'>
          <div className='grid gap-2 min-w-[500px] justify-center'>
            <div>
              <img
                src={event?.image}
                alt={event?.title}
                className='rounded-lg'
              />
            </div>
            <h2 className='font-semibold'>{event?.title}</h2>
            <h3 className='text-sm'>{event?.description}</h3>
            <h3>
              <span className='font-semibold'>Dated:</span>{' '}
              {formatDate(event?.date)}
            </h3>
            <h3>
              <span className='font-semibold'>Venue:</span> {event?.venue.name},{' '}
              {event?.venue.location}
            </h3>
          </div>
          <div className='ticket-booking w-full flex flex-col justify-between gap-4'>
            <div className='grid gap-4'>
              {event?.ticketPrices?.map(
                (ticket: TicketPrice, index: number) => (
                  <div
                    key={index}
                    className='flex items-center justify-between mb-4 p-4 border rounded-lg shadow-sm'
                  >
                    <div>
                      <h3 className='font-semibold'>{ticket.seatType}</h3>
                      <p className='text-sm text-gray-600'>
                        ₹{ticket.price} | {ticket.availableSeats} seats left
                      </p>
                    </div>
                    <input
                      type='number'
                      min='0'
                      max={ticket.availableSeats}
                      value={ticketSelection[ticket.seatType] || 0}
                      onChange={(e) =>
                        handleSeatSelection(
                          ticket.seatType,
                          ticket.availableSeats,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className='w-20 p-2 border rounded-lg text-center'
                    />
                  </div>
                )
              )}
            </div>
            <Button
              className='self-end'
              type='submit'
              onClick={() => {
                const selectedTickets = Object.entries(ticketSelection)
                  .filter(([, count]) => count > 0)
                  .map(([seatType, count]) => ({
                    seatType,
                    count,
                    price:
                      event.ticketPrices.find(
                        (ticket) => ticket.seatType === seatType
                      )?.price || 0,
                  }));

                if (selectedTickets.length > 0) {
                  navigate(`/${event.id}/pay`, {
                    state: {event, ticketSelection: selectedTickets},
                  });
                } else {
                  toast.error('Please select at least one ticket!');
                }
              }}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDialog;
