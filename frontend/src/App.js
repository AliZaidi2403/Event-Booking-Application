import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AuthPage from "./Pages/AuthPage";
import BookingsPage from "./Pages/BookingsPage";
import EventsPage from "./Pages/EventsPage";
import MainNavigation from "./Components/Navigation/MainNavigation";
import { useAuth } from "./Context/AuthContext";
function App() {
  const { token } = useAuth();
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/auth" Component={AuthPage} />
            <Route path="/events" Component={EventsPage} />
            <Route path="/bookings" Component={BookingsPage} />
          </Routes>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
