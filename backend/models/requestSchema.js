const mongoose = require("mongoose");

const requestModel = mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  appliedCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: String,
    default: "pending",
  },
  roomCode:{
    type:String,
    required: true,
  }
});

module.exports = mongoose.model("Request", requestModel);
