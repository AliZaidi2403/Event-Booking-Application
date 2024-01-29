const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
); //timeStamps tell mongoose fields to add fields like createdAt and updatedAt to our schema

module.exports = mongoose.model("Booking", bookingSchema);
