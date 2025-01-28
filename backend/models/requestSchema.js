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
  isApproved :{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Request", requestModel);