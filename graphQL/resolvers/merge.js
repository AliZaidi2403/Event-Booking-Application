const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("./../../helpers/date");
const DataLoader = require("dataloader");
//data loader checks that whethere the query we are making is one of the predefined query and it will then
//look if we had already make that request in the past and takes the response from there otherwise make
//the request here and automatically batch it will all request that need same query

//here in batching we create key value pair so that next time a query is been made for the same key
//we already have the value stored for it

//in order for our loader to work properly we need to convert ids in key as string because
//are basically objectid and in javascript even two objects that are exactly same as treated
//as diffrent
const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});
const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});
const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    //  const event = await Event.findById(eventId);
    const event = await eventLoader.load(eventId.toString());
    // return transformEvent(event);
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    //  const user = await User.findById(userId);
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      // createdEvents: events.bind(this, user._doc.createdEvents),
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator.toString()),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
