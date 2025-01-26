const mongoose = require("mongoose");

const jobModel = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:true
  },
  creatorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"business",
    required:true
  },
  appliedCandidates:[
   {
    type: mongoose.Schema.Types.ObjectId,
    ref:"creator",
    required:true
   }     
  ]

  
});

module.exports = mongoose.model("job", jobModel);
