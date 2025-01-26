require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const PORT = 3000;
const saltRounds = 10;

const userModel = require("./models/userSchema");
const authMiddleware = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const userValidationSchema = z
  .object({
    username: z.string().min(2).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password is incorrect",
    path: ["confirmPassword"],
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Successfully connected to the database");
  app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

main();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/signup", (req, res) => {
  res.send("signup");
});

app.post("/signup", async (req, res) => {
  const validation = userValidationSchema.safeParse(req.body);
  if (!validation.success) {
    console.log(validation.error);
    res.send("error during validation");
  }
  const { username, email, password, confirmPassword } = req.body;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(user);
  res.send({
    message: "User successfully created",
    user: user,
  });
});

app.get("/login", (req, res) => {
  res.send("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
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
    process.env.JWT_USER_SECRET,
    { expiresIn: "1d" }
  );
  console.log("Token: " + token);
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  console.log("Cookie has been set successfully");
  res.send("Cookie setting successful");
});

app.get("/verified", authMiddleware, (req, res) => {
  res.send("You are verified");
});
