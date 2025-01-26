require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const creatorRouter = require("./routes/creator");
const businessRouter = require("./routes/business");

const PORT = 3000;

const creatorModel = require("./models/creatorSchema");
const creatorAuthMiddleware = require("./middleware/creatorAuth");
const businessAuthMiddleware = require("./middleware/businessAuth");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/business", businessRouter);
app.use("/creator", creatorRouter);

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

app.get("/verified", creatorAuthMiddleware, (req, res) => {
  res.send("You are verified");
});
