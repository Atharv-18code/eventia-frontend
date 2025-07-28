import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Music", "Tech", "Workshop", "Social"];

const CreateEvent = ({ onNext, data, updateForm }) => {
  const handleChange = (e) => updateForm({ [e.target.name]: e.target.value });

  return (
    <div className="w-[80%] h-[auto] mx-auto my-6 p-6 bg-white rounded-xl shadow overflow-auto space-y-4">
      <h2 className="text-2xl font-semibold">Create a New Event</h2>

      <div>
        <Label>Title</Label>
        <Input name="title" value={data.title || ""} onChange={handleChange} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={data.description || ""} onChange={handleChange} />
      </div>

      <div>
        <Label>Category</Label>
        <select
          name="category"
          value={data.category || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default CreateEvent;

