import { NavLink, useNavigate } from "react-router-dom";
import "./MainNavigation.css";
import { useAuth } from "../../Context/AuthContext";
function MainNavigation(props) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate("/auth", { replace: true });
  }
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Event Handling </h1>
      </div>
      <div className="main-navigation__items">
        <ul>
          {!token && (
            <li>
              <NavLink to="auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="events">Events</NavLink>
          </li>
          {token && (
            <li>
              <NavLink to="bookings">Bookings</NavLink>
            </li>
          )}
          {token && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
//diffrence between navlink and link is navlink get extra css class when they are active so we can
//style them diffrently
//instead of li we uses navlink becase they do not re load the page, they just navigate from route to route
//and keeps us in the already running application
export default MainNavigation;
