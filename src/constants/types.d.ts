export interface User {
    name: string,
    email: string,
    role: string,
    preferences: {
        budgetRange: number,
        categories: string[],
    }
}

export interface TicketPrice {
    seatType: string;
    price: number;
    availableSeats: number;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    isPublic: boolean;
    image: string;
    organizerId: string;
    organizer: Organizer | null;
    venueId: string | null;
    venue: Venue | null;
    ticketPrices: TicketPrice[];
    createdAt: string;
    updatedAt: string;
}

export interface Organizer {
    id: string;
    name: string;
    email: string;
}

export interface Venue {
    id: string;
    name: string;
    location: string;
    capacity: number;
    description: string;
    pricePerDay: number;
    image: string;
}