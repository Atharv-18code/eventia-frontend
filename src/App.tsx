import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import { AuthState } from "./store/slices/authSlice";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import EventDetails from "./pages/EventDetails";
import PublicEvents from "./pages/user-dashboard/PublicEvents";
import UserDashboard from "./pages/user-dashboard/UserDashboard";
import TicketPay from "./pages/user-dashboard/TicketPay";
import Venues from "./pages/user-dashboard/Venues";
import HostEventWrapper from "@/pages/host-events/HostEventWrapper";
import CreateEvent from "@/pages/host-events/CreateEvent";
import EventDetail from "@/pages/host-events/EventDetail";
import EventVisibility from "@/pages/host-events/EventVisibility";
import EventTicket from "@/pages/host-events/EventTicket";
import EventSubmit from "@/pages/host-events/EventSubmit";

const AppRoutes = () => {
  const authenticated = useSelector(
    (state: { auth: AuthState }) => state.auth.authenticated
  );

  return createBrowserRouter([
    {
      path: "/",
      element: authenticated ? (
        <div>
          <DashboardLayout />
        </div>
      ) : (
        <div>
          <Navbar />
          <Home />
        </div>
      ),
      children: authenticated
        ? [
            {
              index: true,
              element: <UserDashboard />,
            },
            {
              path: "events/public",
              element: <PublicEvents />,
            },
            {
              path: "venues/book",
              element: <Venues />,
            },
            {
              path: "bookings",
              element: <div>Public Events</div>,
            },
            {
              path: "tickets",
              element: <div>My Tickets</div>,
            },
            {
              path: "host-event",
              element: <HostEventWrapper />,
              children: [
                {
                  index: true,
                  element: <CreateEvent />,
                },
                {
                  path: "details",
                  element: <EventDetail />,
                },
                {
                  path: "visibility",
                  element: <EventVisibility />,
                },
                {
                  path: "tickets",
                  element: <EventTicket />,
                },
                {
                  path: "EventSubmit",
                  element: <EventSubmit />,
                },
              ],
            },
          ]
        : [],
    },
    {
      path: "/:eventId/pay",
      element: authenticated ? (
        <div>
          <TicketPay />
        </div>
      ) : (
        <div>
          <Navbar />
          <Home />
        </div>
      ),
    },
    {
      path: "/*",
      element: <NotFound />,
    },
    {
      path: "/login",
      element: authenticated ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Navbar />
          <Login />
        </div>
      ),
    },
    {
      path: "/events",
      element: authenticated ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Navbar />
          <Events />
        </div>
      ),
    },
    {
      path: "/event/:eventId",
      element: authenticated ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Navbar />
          <EventDetails />
        </div>
      ),
    },
    {
      path: "/signup",
      element: authenticated ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Navbar />
          <Signup />
        </div>
      ),
    },
    {
      path: "/forgot-password",
      element: authenticated ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Navbar />
          <ForgotPassword />
        </div>
      ),
    },
    {
      path: "/reset-password",
      element: authenticated ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Navbar />
          <ResetPassword />
        </div>
      ),
    },
  ]);
};

function App() {
  return (
    <div>
      <RouterProvider router={AppRoutes()} />
      <Toaster
        containerClassName="text-xs"
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
