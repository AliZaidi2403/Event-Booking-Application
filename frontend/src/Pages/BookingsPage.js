import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Components/Loader/Loader";
import BookingList from "../Components/Bookings/BookingList/BookingList";
function BookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  function fetchBookings() {
    setIsLoading(true);
    const reqBody = {
      query: `
        query {
            bookings
            {
              _id
              event{
                _id
                title 
                date
              }
              createdAt
              updatedAt
            }
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
        const bookings = resData.data.bookings;
        console.log(bookings);
        setBookings((booking) => [...bookings]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  useEffect(function () {
    fetchBookings();
  }, []);
  return isLoading ? (
    <Loader />
  ) : (
    <BookingList bookings={bookings} setBookings={setBookings} />
  );
}

export default BookingsPage;
