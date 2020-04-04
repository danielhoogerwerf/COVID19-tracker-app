const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// BSN Schema
const BsnSchema = new Schema({
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
