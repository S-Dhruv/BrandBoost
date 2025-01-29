const mongoose = require("mongoose");

const creatorModel = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isApproved:{
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Creator", creatorModel);
