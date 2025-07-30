import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EventVisibility = ({ onNext, onBack, data, updateForm }) => {
  const handleNext = () => {
    // Convert string value to boolean
    const isPublic = data.visibility === "public";
    updateForm({ isPublic }); // Update with boolean for backend
    onNext();
  };

  return (
    <div className="w-[80%] h-[auto] mx-auto my-6 p-6 bg-white rounded-xl shadow overflow-auto space-y-4">
      <h2 className="text-2xl font-semibold">Event Visibility</h2>

      <RadioGroup
        defaultValue={data.visibility}
        onValueChange={(val) => updateForm({ visibility: val })}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public" />
          <Label htmlFor="public">Public</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id="private" />
          <Label htmlFor="private">Private</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};

export default EventVisibility;
