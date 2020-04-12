const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// BSN Schema
const BsnSchema = new Schema({
  // Number removes the 0 from values that start with it. Use STRING to store these type of numbers in the future!
  bsnnumber: Number,
  name: String,
  birthdate: Date,
  age: Number,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  }
});

const BSN = mongoose.model("BSN", BsnSchema);
module.exports = BSN;
