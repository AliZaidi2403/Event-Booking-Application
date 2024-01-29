const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//mongoose schema is a document data structure that deifnes the shape of the document via
//applicaiton layer
//while models are the cotructor that takes in a schema and create an instance of the document
//it provide an instance to the database for creating, quering and manipulating data

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Event", eventSchema);
