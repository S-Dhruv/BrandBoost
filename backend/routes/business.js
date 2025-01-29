const { Router } = require("express");
const businessModel = require("../models/businessSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const businessAuthMiddleware = require("../middleware/businessAuth");
const z = require("zod");
const jobModel = require("../models/jobSchema");
const businessRouter = Router();
const saltRounds = 10;
const creatorPostModel = require("../models/creatorPostSchema");
const requestModel = require("../models/requestSchema");
const creatorModel = require("../models/creatorSchema");
const userValidationSchema = z
  .object({
    username: z.string().min(2).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
    phone: z.string().min(10).max(10),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password is incorrect",
    path: ["confirmPassword"],
  });

businessRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await businessModel.findOne({ email: email });
  console.log(user);
  const result = bcrypt.compare(password, user.password);
  if (!result) {
    res.status(404).send("Invalid email or password");
  }
  console.log("Correct Password");
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_BUSINESS_SECRET,
    { expiresIn: "1d" }
  );
  console.log("Token: " + token);
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  console.log("Cookie has been set successfully");
  res.json({ token, message: "Login successful", role: "business" });
});

businessRouter.post("/signup", async (req, res) => {
  const validation = userValidationSchema.safeParse(req.body);
  if (!validation.success) {
    console.log(validation.error);
    res.send("error during validation");
  }
  const { username, email, password, confirmPassword, phone } = req.body;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await businessModel.create({
    username,
    phone,
    email,
    password: hashedPassword,
  });
  console.log(user);
  res.send({
    message: "User successfully created",
    user: user,
  });
});

// TEST ROUTE

businessRouter.get("/verified", businessAuthMiddleware, (req, res) => {
  res.send("You are verified");
});

//POSTING A JOB

businessRouter.post(
  "/dashboard/upload",
  businessAuthMiddleware,
  async (req, res) => {
    let candidate = [];
    const { title, description, roomCode } = req.body;
    candidate.push(`67965f0752f3723652c33ea2`);
    console.log(req.userId);
    const newJob = await jobModel.create({
      title,
      description,
      creatorId: req.userId,
      candidate,
      roomCode,
    });
    console.log(newJob);
    res.json({
      newJob,
      message: { message: "Job has been uploaded successfully" },
    });
  }
);

// VIEWING ALL THE JOBS CREATED

businessRouter.get(
  "/dashboard/jobs",
  businessAuthMiddleware,
  async (req, res) => {
    const jobs = await jobModel.find({}).populate("creatorId", "username");
    console.log(jobs);
    res.json(jobs);
  }
);

// VIEWING ALL THE POSTS CREATED BY THE CREATOR
businessRouter.get(
  "/dashboard/posts/view",
  businessAuthMiddleware,
  async (req, res) => {
    const posts = await creatorPostModel.find({});
    res.json(posts);
  }
);

// GETTING A LIST OF ALL THE APPLICANTS FOR THE PARTICULAR JOB

businessRouter.get(
  "/dashboard/requests/:jobId",
  businessAuthMiddleware,
  async (req, res) => {
    try {
      const jobId = req.params.jobId;
      console.log(jobId);
      const job = await jobModel.findOne({ _id: jobId });
      console.log(job);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const candid = job.appliedCandidates;
      console.log(candid);

      if (candid && candid.length > 0) {
        let detailsOfCandidates = await Promise.all(
          candid.map(async (user) => {
            console.log(user);
            let name = await creatorModel.findById(user);
            return name;
          })
        );

        res.status(200).json({ message: "Jobs here", detailsOfCandidates });
      } else {
        res.status(404).json({ message: "No candidates applied for this job" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// THE BUSINESS APPROVING THE PARTICULAR CANDIDATE FOR THE JOB
businessRouter.post(
  "/dashboard/requests/:jobId/approve",
  businessAuthMiddleware,
  async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const approvedId = req.body.approvedId;

      if (!approvedId) {
        return res.status(400).json({ message: "Approved candidate ID is required" });
      }

      const job = await jobModel.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.approvedCandidate !== null) {
        return res.status(400).json({ message: "Job has already been assigned to a candidate" });
      }

      job.approvedCandidate = approvedId;
      await job.save();

      const request = await requestModel.findOne({
        jobId: jobId,
        appliedCandidate: approvedId,
      });

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.isApproved = true;
      await request.save();

      res.status(200).json({ message: "Job approved successfully" });

    } catch (err) {
      console.error("Error approving job:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

businessRouter.get(
  "/dashboard/requests",
  businessAuthMiddleware,
  async (req, res) => {
    const businessId = req.userId;
    console.log(businessId);
    const jobs = await jobModel
      .find({ creatorId: businessId })
      .populate("creatorId", "username");
    console.log(jobs);
    res.json(jobs);
  }
);

businessRouter.get(
  "/dashboard/ongoing",
  businessAuthMiddleware,
  async (req, res) => {
    const businessId = req.userId;
    console.log(businessId);
    const jobs = await jobModel
      .find({ creatorId: businessId, approvedCandidate: { $ne: null } })
      .populate("creatorId", "username");
    console.log(jobs);
    res.json(jobs);
  }
);
module.exports = businessRouter;
