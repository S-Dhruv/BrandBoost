const { Router } = require("express");
const creatorModel = require("../models/businessSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const creatorAuthMiddleware = require("../middleware/creatorAuth");
const z = require("zod");

const creatorRouter = Router();
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
  const { email, password } = req.body;
  const user = await creatorModel.findOne({ email: email });
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
    process.env.JWT_CREATOR_SECRET,
    { expiresIn: "1d" }
  );
  console.log("Token: " + token);
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  console.log("Cookie has been set successfully");
  res.send("Cookie setting successful");
});

creatorRouter.post("/signup", async (req, res) => {
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
});

creatorRouter.get("/verified", creatorAuthMiddleware, (req, res) => {
  res.send("You are verified");
});

module.exports = creatorRouter;
