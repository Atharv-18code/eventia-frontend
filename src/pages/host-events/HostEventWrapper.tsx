import { useState } from "react";
import CreateEvent from "./CreateEvent";
import EventDetail from "./EventDetail";
import EventVisibility from "./EventVisibility";
import EventTicket from "./EventTicket";
import toast from "react-hot-toast";
import axiosInstance from "@/interceptors/AxiosInterceptor";

// TicketPrice type
type TicketPrice = {
  seatType: string;
  price: number;
  availableSeats: number;
};

// Form data structure
type HostFormData = {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  venueId?: string;
  image?: File | null;
  visibility?: string;
  ticketPrices: TicketPrice[];
};

const HostEventWrapper = () => {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<HostFormData>({
    ticketPrices: [{ seatType: "", price: 0, availableSeats: 0 }],
  });

  const updateForm = (fields: Partial<HostFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSubmit = async () => {
    const body = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value) {
        body.append("image", value as Blob);
      } else {
        body.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post("/api/events", body, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Event created successfully!");
        setStep(0);
        setFormData({
          ticketPrices: [{ seatType: "", price: 0, availableSeats: 0 }],
        });
      } else {
        toast.error(response.data?.message || "Failed to create event.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong during submission."
      );
    }
  };

  const steps = [
    <CreateEvent
      onNext={() => setStep(1)}
      data={formData}
      updateForm={updateForm}
    />,
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
      onBack={() => setStep(2)}
      data={{ ticketPrices: formData.ticketPrices }}
      updateForm={(newTicketData) => updateForm(newTicketData)}
      onSubmit={handleSubmit}
    />,
  ];

  return <div>{steps[step]}</div>;
};

export default HostEventWrapper;
