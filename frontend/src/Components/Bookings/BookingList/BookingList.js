import { useAuth } from "../../../Context/AuthContext";
import "./BookingList.css";
function BookingList({ bookings, setBookings }) {
  const { token } = useAuth();
  function handleDelete(id) {
    const reqBody = {
      query: `
          mutation {
              cancelBooking(bookingId : "${id}")
              {
                _id
                title}
          }
          `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(" Request Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedBooking = bookings.filter((booking) => {
          return booking._id !== id;
        });
        setBookings(updatedBooking);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <ul className="bookings__list">
      {bookings?.map((booking) => {
        return (
          <li className="bookings__item" key={booking._id}>
            <div className="bookings__item-data">
              {booking.event.title} -{" "}
              {new Date(booking.event.date).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
              <button
                className="btn"
                onClick={() => {
                  handleDelete(booking._id);
                }}
              >
                Cancel Booking
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default BookingList;
