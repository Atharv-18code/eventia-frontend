import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

type TicketPrice = {
  seatType: string;
  price: number;
  availableSeats: number;
};

interface EventTicketProps {
  data: { ticketPrices: TicketPrice[] };
  updateForm: (form: { ticketPrices: TicketPrice[] }) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const EventTicket: React.FC<EventTicketProps> = ({ data, updateForm, onBack, onSubmit }) => {
  const ticketPrices: TicketPrice[] = data.ticketPrices && data.ticketPrices.length > 0
    ? data.ticketPrices
    : [{ seatType: "", price: 0, availableSeats: 0 }];

  const handleAddTicket = () => {
    const updated = [
      ...ticketPrices,
      { seatType: "", price: 0, availableSeats: 0 },
    ];
    updateForm({ ticketPrices: updated });
  };

  const handleChange = (
    index: number,
    field: keyof TicketPrice,
    value: string
  ) => {
    const updated: TicketPrice[] = [...ticketPrices];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "price" || field === "availableSeats"
          ? parseInt(value) || 0
          : value,
    };
    updateForm({ ticketPrices: updated });
  };

  const handleRemove = (index: number) => {
    const updated = [...ticketPrices];
    updated.splice(index, 1);
    updateForm({ ticketPrices: updated });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Ticket Pricing</h2>
        <Button onClick={handleAddTicket} variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Ticket Type
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ticketPrices.map((ticket, index) => (
          <Card key={index}>
            <CardContent className="p-4 space-y-2">
              <div>
                <Label htmlFor={`seatType-${index}`}>Seat Type</Label>
                <Input
                  id={`seatType-${index}`}
                  value={ticket.seatType}
                  onChange={(e) =>
                    handleChange(index, "seatType", e.target.value)
                  }
                  placeholder="e.g. Balcony"
                />
              </div>
              <div>
                <Label htmlFor={`price-${index}`}>Price (₹)</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  value={ticket.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`availableSeats-${index}`}>
                  Available Seats
                </Label>
                <Input
                  id={`availableSeats-${index}`}
                  type="number"
                  value={ticket.availableSeats}
                  onChange={(e) =>
                    handleChange(index, "availableSeats", e.target.value)
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemove(index)}
                  className="w-full"
                  disabled={ticketPrices.length === 1}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit}>Submit & Finish</Button>
      </div>
    </div>
  );
};

export default EventTicket;
