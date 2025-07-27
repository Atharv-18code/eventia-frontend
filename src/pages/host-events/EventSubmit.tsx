import { Button } from "@/components/ui/button";

const EventSubmit = ({ onBack, onSubmit }) => {
  return (
    <div className="w-[80%] h-[80vh] mx-auto my-6 p-6 bg-white rounded-xl shadow space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Submit Event</h2>
      <p>You're all set! Click below to post your event.</p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default EventSubmit;
