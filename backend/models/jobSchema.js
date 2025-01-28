const mongoose = require("mongoose");

const jobModel = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  appliedCandidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },
  ],
  roomCode:{
      type: String,
      required:true
  },
  
});

module.exports = mongoose.model("Job", jobModel);
