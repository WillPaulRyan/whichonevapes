const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const celebSchema = new Schema({
  _id: {
    type: Number,
    required: [true, "ID is required"]
  },
  name: {
    type: String,
    required: [true, "Username is required"]
  },
  pic: {
    type: String,
    required: [true, "Pic is required"]
  },
  elo: {
    type: Number,
    default: 1500
  }
});

module.exports = Celeb = mongoose.model("celeb", celebSchema, "celebs");
