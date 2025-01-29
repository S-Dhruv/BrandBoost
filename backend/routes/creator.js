const { Router } = require("express");
const creatorModel = require("../models/creatorSchema");
const requestModel = require("../models/requestSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const creatorAuthMiddleware = require("../middleware/creatorAuth");
const z = require("zod");
const jobModel = require("../models/jobSchema");
const creatorPostModel = require("../models/creatorPostSchema");
const shortid = require("shortid");
const rooms = require("../index");
const creatorRouter = Router();
const {sendMail} = require("../utils/emailUtils");
const saltRounds = 10;
const userValidationSchema = z
  .object({
    username: z.string().min(2).max(30),
    email: z.string().email(),
    phone: z.string().min(10).max(10),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password is incorrect",
    path: ["confirmPassword"],
  });

  creatorRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await creatorModel.findOne({ email: email });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const result = await bcrypt.compare(password, user.password); // Use await here
      if (!result) {
        return res.status(404).send("Invalid email or password");
      }
  
      console.log("Correct Password");
      const token = jwt.sign(
        {
          userId: user._id,
          role: "creator",
        },
        process.env.JWT_CREATOR_SECRET,
        { expiresIn: "1d" }
      );
  
      console.log("Token: " + token);
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({
        token,
        message: "Login successful",
        role: "creator",
        isApproved: user.isApproved, // Send the actual isApproved value from the database
      });
  
      console.log("Cookie has been set successfully");
  
      if (user.isApproved === false) {
        sendMail(user);
        console.log("Email sent");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  });
creatorRouter.post("/signup", async (req, res) => {
  try {
    const validation = userValidationSchema.safeParse(req.body);
    if (!validation.success) {
      console.log(validation.error);
      res.send("error during validation");
    }
    const { username, email, phone, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await creatorModel.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });
    console.log(user);
    res.send({
      message: "User successfully created",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
});

creatorRouter.get("/verified", creatorAuthMiddleware, (req, res) => {
  res.send("You are verified");
});
creatorRouter.get(
  "/dashboard/jobs",
  creatorAuthMiddleware,
  async (req, res) => {
    const jobs = await jobModel.find({}).populate("creatorId", "username");
    res.json(jobs);
  }
);

creatorRouter.post(
  "/dashboard/posts/upload",
  creatorAuthMiddleware,
  async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;
    const post = await creatorPostModel.create({
      title,
      description,
      creatorId: userId,
    });
    res.json(post);
  }
);
creatorRouter.get(
  "/dashboard/posts/view",
  creatorAuthMiddleware,
  async (req, res) => {
    const posts = await creatorPostModel.find({});
    res.json(posts);
  }
);

// creatorRouter.post(
//   "/dashboard/jobs/apply/:jobId",
//   creatorAuthMiddleware,
//   async (req, res) => {
//     const jobId = req.params.jobId;
//     const userId = req.userId;
//     const job = await jobModel.findById(jobId);
//     if (!job) return res.status(404).json("Job not found");
//     if (job.appliedCandidates.includes(userId))
//       return res.status(404).json("You have already applied for this job");
//     job.appliedCandidates.push(userId);
//     await job.save();
//     res.json("Successfully applied for the job");
//   }
// );
creatorRouter.get(
  "/dashboard/ongoing/room/create",
  creatorAuthMiddleware,
  async (req, res) => {
    try {
      const roomCode = shortid(6);
      rooms[roomCode] = [];
      rooms[roomCode].push(req.username);
      console.log(roomCode);
      res.status(200).json({ roomCode });
    } catch (err) {
      console.log(err);
    }
  }
);
creatorRouter.post(
  "/dashboard/ongoing/room/join",
  creatorAuthMiddleware,
  async (req, res) => {
    try {
      const roomCode = req.body.roomCode;
      console.log(rooms);
      if (!rooms[roomCode]) {
        return res.status(404).json("Room not found");
      }
      rooms[roomCode].push(req.username);
      res.status(200).json("Successfully joined room");
    } catch (err) {
      console.log(err);
    }
  }
);
creatorRouter.post(
  "/dashboard/jobs/apply/:jobId",
  creatorAuthMiddleware,
  async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const userId = req.userId;

      // Find the job
      const job = await jobModel.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });
      const roomCode = job.roomCode;
      console.log(roomCode);
      // Check if the user has already applied
      if (job.appliedCandidates.includes(userId)) {
        return res
          .status(400)
          .json({ message: "You have already applied for this job" });
      }

      // Add the user to the appliedCandidates array
      job.appliedCandidates.push(userId);
      await job.save();

      // Create a new request
      const request = await requestModel.create({
        jobId,
        businessId: job.creatorId,
        appliedCandidate: userId,
        isApproved: false,
        roomCode,
      });

      console.log(request);
      res.json({ message: "Successfully applied for the job", request });
    } catch (err) {
      console.log(err);
      if (err.name === "ValidationError") {
        res
          .status(400)
          .json({ error: "Validation failed", details: err.message });
      } else {
        res
          .status(500)
          .json({ error: "Failed to apply for the job", details: err.message });
      }
    }
  }
);

creatorRouter.get(
  "/dashboard/ongoing",
  creatorAuthMiddleware,
  async (req, res) => {
    try {
      const userId = req.userId;
      const jobs = await jobModel.find({
        approvedCandidate: userId,
        isCompleted: false,
      });
      res.json(jobs);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = creatorRouter;
