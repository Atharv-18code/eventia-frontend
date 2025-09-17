import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import axiosInstance from "@/interceptors/AxiosInterceptor";
import { Venue } from "@/constants/types";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

interface VenueSelectProps {
  onNext: () => void;
  onBack: () => void;
  data: {
    venueId?: string;
  };
  updateForm: (fields: { venueId: string }) => void;
}

const VenueSelect = ({ onNext, onBack, data, updateForm }: VenueSelectProps) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(data.venueId);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axiosInstance.get("/api/venues");
        console.log("API Response:", response.data); // Debug log
        
        // Handle different response formats
        let venuesData;
        if (response.data.data && Array.isArray(response.data.data)) {
          venuesData = response.data.data;
        } else if (response.data.venues && Array.isArray(response.data.venues)) {
          venuesData = response.data.venues;
        } else if (Array.isArray(response.data)) {
          venuesData = response.data;
        } else {
          console.error("Unexpected API response format:", response.data);
          toast.error("Invalid venue data received");
          setVenues([]);
          return;
        }
        
        // Validate venue objects
        const validVenues = venuesData.filter(venue => 
          venue && typeof venue === 'object' && 
          'id' in venue && 
          'name' in venue && 
          'location' in venue
        );
        
        if (validVenues.length === 0) {
          console.error("No valid venues found in:", venuesData);
          toast.error("No valid venues available");
          setVenues([]);
          return;
        }
        
        setVenues(validVenues);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
        toast.error("Failed to load venues. Please try again.");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleNext = () => {
    if (!selectedVenueId) {
      toast.error("Please select a venue");
      return;
    }
    updateForm({ venueId: selectedVenueId });
    onNext();
  };

  return (
    <div className="w-[80%] h-[auto] mx-auto my-6 p-6 bg-white rounded-xl shadow overflow-auto space-y-4">
      <h2 className="text-2xl font-semibold">Select a Venue</h2>
      <p className="text-gray-500">Choose a venue for your event</p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Spinner size="large" />
        </div>
      ) : venues.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">No venues available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {venues.map((venue) => (
            <Card
              key={venue.id}
              className={`cursor-pointer transition-all ${
                selectedVenueId === venue.id
                  ? "ring-2 ring-primary shadow-lg scale-105"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedVenueId(venue.id)}
            >
              <CardHeader className="p-0">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg">{venue.name}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {venue.location}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Capacity: {venue.capacity} people
                </p>
                <p className="font-medium text-primary mt-1">
                  ₹{venue.pricePerDay}/day
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};

export default VenueSelect;
