import EventItem from "./EventItem/EventItem";
import "./EventList.css";
function EventList({ events, authUserId, onViewDetail }) {
  return (
    <ul className="events__list">
      {events.map((event) => {
        return (
          <EventItem
            event={event}
            key={event._id}
            userId={authUserId}
            onDetail={onViewDetail}
          />
        );
      })}
    </ul>
  );
}

export default EventList;
