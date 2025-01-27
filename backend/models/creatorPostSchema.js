const mongoose = require("mongoose");

const creatorPostModel = mongoose.Schema({
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
    ref: "Creator",
    required: true,
  },
});

module.exports = mongoose.model("CreatorPost", creatorPostModel);
