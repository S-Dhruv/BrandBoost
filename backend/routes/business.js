const { Router } = require("express");
const businessModel = require("../models/businessSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const businessAuthMiddleware = require("../middleware/businessAuth");
const z = require("zod");
const jobModel = require("../models/jobSchema");
const businessRouter = Router();
const saltRounds = 10;

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
  res.json({token,message:"Login successful",role:"business"})
});

businessRouter.post("/signup", async (req, res) => {
  const validation = userValidationSchema.safeParse(req.body);
  if (!validation.success) {
    console.log(validation.error);
    res.send("error during validation");
  }
  const { username, email, password, confirmPassword,phone } = req.body;
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

businessRouter.get("/verified", businessAuthMiddleware, (req, res) => {
  res.send("You are verified");
});

businessRouter.post("/dashboard/upload",businessAuthMiddleware, async (req, res) => {
  let candidate = [];
  const {title,description} =req.body;
  candidate.push(`67965f0752f3723652c33ea2`);
  console.log(req.userId);
  const newJob = await jobModel.create({
    title,
    description,
    creatorId:req.userId,
    candidate,
  });
  console.log(newJob);
  res.json({newJob,message:{message:"Job has been uploaded successfully"}});
});
businessRouter.get("/dashboard/jobs", businessAuthMiddleware,(req, res) => {
  const jobs = jobModel.find({});
  res.json(jobs);
});
businessRouter.get("/dashboard/posts/view", businessAuthMiddleware, async (req, res) => {
  const posts = await creatorPostModel.find({});
  res.json(posts);
})
module.exports = businessRouter;
