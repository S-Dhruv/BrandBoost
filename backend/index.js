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
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend's origin
    methods: ["GET", "POST"],
  },
});


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
let rooms = {};
app.use("/business", businessRouter);
app.use("/creator", creatorRouter);

// Middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_CREATOR_SECRET);
    socket.userId = decoded.userId;
    const creatorName = await creatorModel.findById(decoded.userId);
    socket.username = creatorName.username 
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.username} connected to socket`);

  socket.on("join-room", ({ room }) => {
    try {
      if (!room) throw new Error("Room code is required");
      
      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push(socket.username);
      socket.join(room);
      console.log(rooms);
      io.to(room).emit("join-room", { room, username: socket.username });
      console.log(`${socket.username} joined room ${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("send-message", ({ room, message }) => {
    try {
      if (!room || !message) throw new Error("Room and message are required");
      
      io.to(room).emit("send-message", { 
        message, 
        username: socket.username 
      });
      console.log(`Message from ${socket.username} in room ${room}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("leave-room", ({ room }) => {
    if (rooms[room]) {
      rooms[room] = rooms[room].filter((user) => user !== socket.username);
      socket.leave(room);
      io.to(room).emit("user-left", { username: socket.username, room });
      console.log(`${socket.username} left room ${room}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((user) => user !== socket.username);
      io.to(room).emit("user-left", { username: socket.username, room });
    }
  });
});




async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Successfully connected to the database");
  server.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}

main();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/verified", creatorAuthMiddleware, (req, res) => {
  res.send("You are verified");
});
