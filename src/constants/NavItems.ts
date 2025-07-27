import {
  BookOpen,
  MapPinCheckInside,
  SquareTerminal,
  Ticket,
  UsersRound,
  SquarePlus, // 👈 Import here
} from "lucide-react";

export const NavItems = {
  USER: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Public Events",
      url: "/events/public",
      icon: UsersRound,
    },
    {
      title: "My Tickets",
      url: "/tickets",
      icon: Ticket,
    },
    {
      title: "Book a Venue",
      url: "/venues/book",
      icon: MapPinCheckInside,
    },
    {
      title: "My Bookings",
      url: "/bookings",
      icon: BookOpen,
    },
    {
      title: "Host Event",
      url: "/host-event",
      icon: SquarePlus, // ✅ Using SquarePlus for hosting
    },
  ],
  ADMIN: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
    },
  ],
};
