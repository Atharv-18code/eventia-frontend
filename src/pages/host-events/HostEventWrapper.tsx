import { useState } from "react";
import CreateEvent from "./CreateEvent";
import EventDetail from "./EventDetail";
import EventVisibility from "./EventVisibility";
import EventTicket from "./EventTicket";
import EventSubmit from "./EventSubmit";

const HostEventWrapper = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const updateForm = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value) {
        if (value instanceof Blob) {
          body.append("image", value);
        } else {
          // If value is not a Blob/File, convert to string or handle error
          body.append("image", String(value));
        }
      } else {
        body.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
      }
    });

    const res = await fetch("/api/events", {
      method: "POST",
      body,
    });

    if (res.ok) {
      alert("Event created successfully!");
      setStep(0);
      setFormData({});
    } else {
      alert("Failed to create event.");
    }
  };

  const steps = [
    <CreateEvent onNext={() => setStep(1)} data={formData} updateForm={updateForm} />,
    <EventDetail
      onNext={() => setStep(2)}
      onBack={() => setStep(0)}
      data={formData}
      updateForm={updateForm}
    />,
    <EventVisibility
      onNext={() => setStep(3)}
      onBack={() => setStep(1)}
      data={formData}
      updateForm={updateForm}
    />,
    <EventTicket
      onNext={() => setStep(4)}
      onBack={() => setStep(2)}
      data={formData}
      updateForm={updateForm}
    />,
    <EventSubmit onBack={() => setStep(3)} onSubmit={handleSubmit} />,
  ];

  return <div>{steps[step]}</div>;
};

export default HostEventWrapper;