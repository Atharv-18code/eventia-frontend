import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const EventDetail = ({ onNext, onBack, data, updateForm }) => {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <div className="w-[80%] h-[auto] mx-auto my-6 p-6 bg-white rounded-xl shadow overflow-auto space-y-4">
      <h2 className="text-2xl font-semibold">Event Details</h2>

      <div>
        <Label>Date</Label>
        <Input type="date" name="date" value={data.date || ""} onChange={handleChange} />
      </div>

      {/* <div>
        <Label>Venue ID</Label>
        <Input name="venueId" value={data.venueId || ""} onChange={handleChange} />
      </div> */}

      <div>
        <Label>Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => updateForm({ image: e.target.files?.[0] || null })}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default EventDetail;
