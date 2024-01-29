import Modal from "../Components/Modal/Modal";
import "./Events.css";
import Backdrop from "../Components/BackDrop/Backdrop";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./../Context/AuthContext";
import EventList from "./../Components/Events/EventList/EventList";
import Loader from "../Components/Loader/Loader";
function EventsPage() {
  const { token, userId } = useAuth();
  const [creating, setCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvent] = useState([]);
  const titleRef = useRef();
  const priceRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();

  function showDetail(eventId) {
    const event = events.find((event) => event._id === eventId);
    setSelectedEvent(event);
  }
  function bookEventHanlder() {
    if (!token) {
      setSelectedEvent(null);

      return;
    }
    const reqBody = {
      query: `
        mutation {
            bookEvent(eventId : "${selectedEvent._id}")
            {
              _id
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
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSelectedEvent(null);
      });
  }
  function createEventHandler() {
    setCreating(!creating);
  }
  function modalCancelHandler() {
    setCreating(false);
    setSelectedEvent(null);
  }
  function modelConfirmHandler() {
    setCreating(false);
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const event = { title, date, description, price };
    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0
    ) {
      return;
    }
    console.log(event);

    const reqBody = {
      query: `
        mutation {
            createEvent(eventInput : {title : "${title}", description : "${description}", price : ${price}, date : "${date}"})
            {
              _id
              title 
              description
              price
              creator{
                _id
                email
              }
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
        console.log(resData);
        setEvent((events) => [...events, resData.data.createEvent]);
        console.log(events);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function fetchEvents() {
    setIsLoading(true);
    const reqBody = {
      query: `
        query {
            events
            {
              _id
              title 
              description
              date
              price
              creator{
                _id
                email
              }
            }
        }
        `,
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(" Request Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        console.log(events);
        setEvent((event) => [...events]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  useEffect(function () {
    fetchEvents();
  }, []);
  return (
    <>
      {(creating || selectedEvent) && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modelConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                ref={descriptionRef}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHanlder}
          confirmText={token ? "Book" : "Not Authenticated"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {token && (
        <div className="events-control">
          <p>Let us know about your event </p>
          <button className="btn" onClick={createEventHandler}>
            Create Event{" "}
          </button>
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <EventList
          events={events}
          authUserId={userId}
          onViewDetail={showDetail}
        />
      )}
    </>
  );
}

export default EventsPage;
