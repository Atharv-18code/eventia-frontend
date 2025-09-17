import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Event} from '@/constants/types';
import {useState} from 'react';

interface TicketBookingDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const TicketBookingDialog = ({event, isOpen, onClose}: TicketBookingDialogProps) => {
  const [numberOfTickets, setNumberOfTickets] = useS0tate(1);

  const handleBooking = () => {
    // TODO: Implement ticket booking logic
    console.log('Booking tickets:', {
      eventId: event?.id,
      numberOfTickets,
    });
    onClose();
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Book Tickets - {event.title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='tickets' className='col-span-4'>
              Number of Tickets
            </Label>
            <Input
              id='tickets'
              type='number'
              min={1}
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
              className='col-span-4'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='col-span-4'>Event Details</Label>
            <div className='col-span-4 space-y-2'>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Price:</strong> ${event.ticketPrices[0]?.price || 0}</p>
              <p><strong>Total:</strong> ${(event.ticketPrices[0]?.price || 0) * numberOfTickets}</p>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-4'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBooking}>
            Book Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketBookingDialog;
