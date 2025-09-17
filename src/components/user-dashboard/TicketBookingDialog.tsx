import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Event} from '@/constants/types';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {AuthState} from '@/store/slices/authSlice';
import axiosInstance from '@/interceptors/AxiosInterceptor';
import {toast} from 'sonner';

interface TicketBookingDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function TicketBookingDialog({event, isOpen, onClose}: TicketBookingDialogProps) {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useSelector((state: {auth: AuthState}) => state.auth.user);

  const handlePayment = async (orderId: string) => {
    if (!user || !event) return;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: (event.ticketPrices[0]?.price || 0) * numberOfTickets * 100, // amount in paise
      currency: "INR",
      name: "Eventia",
      description: `Tickets for ${event.title}`,
      order_id: orderId,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          setIsProcessing(true);
          const result = await axiosInstance.post(`/api/tickets/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            eventId: event.id,
            numberOfTickets,
          });

          if (result.data.success) {
            toast.success('Tickets booked successfully!');
            onClose();
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          toast.error('Payment verification failed');
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#6366f1",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handleBooking = async () => {
    if (!user || !event) return;

    try {
      setIsProcessing(true);
      const requestData = {
        eventId: event.id,
        numberOfTickets: parseInt(numberOfTickets.toString()),
        amount: parseFloat(((event.ticketPrices[0]?.price || 0) * numberOfTickets).toFixed(2)),
      };
      console.log('Creating order with data:', requestData);

      const response = await axiosInstance.post(`/api/tickets/create-order`, requestData);
      console.log('Order creation response:', response.data);

      if (response.data.orderId) {
        handlePayment(response.data.orderId);
      } else {
        throw new Error('No order ID received from server');
      }
    } catch (err: any) {
      console.error('Order creation error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!event || !user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Book Tickets - {event.title}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='col-span-4'>User Details</Label>
            <div className='col-span-4 space-y-2'>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='tickets' className='col-span-4'>
              Number of Tickets
            </Label>
            <Input
              id='tickets'
              type='number'
              min={1}
              value={numberOfTickets}
              onChange={(e) => setNumberOfTickets(parseInt(e.target.value) || 1)}
              className='col-span-4'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='col-span-4'>Event Details</Label>
            <div className='col-span-4 space-y-2'>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Price:</strong> ₹{event.ticketPrices[0]?.price || 0}</p>
              <p><strong>Total:</strong> ₹{(event.ticketPrices[0]?.price || 0) * numberOfTickets}</p>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-4'>
          <Button variant='outline' onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Book Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketBookingDialog;

// export {TicketBookingDialog as default};
