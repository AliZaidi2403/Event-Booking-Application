import "./EventItem.css";
function EventItem({ event, userId, onDetail }) {
  return (
    <li className="events__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {event.creator._id === userId ? (
          <p>You are the organizer of the event </p>
        ) : (
          <button className="btn" onClick={onDetail.bind(this, event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
}

export default EventItem;
