require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const z = require("zod");
const bcrypt = require("bcrypt");
const cors = require("cors");
const creatorRouter = require("./routes/creator");
const businessRouter = require("./routes/business");
const PORT = 3000;
const creatorModel = require("./models/creatorSchema");
const businessModel = require("./models/businessSchema");
const jobModel = require("./models/jobSchema");

const creatorAuthMiddleware = require("./middleware/creatorAuth");
const businessAuthMiddleware = require("./middleware/businessAuth");
const http = require("http");
const {Server} = require("socket.io");
const jwt = require("jsonwebtoken");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let rooms = {};

// Routes
app.use("/business", businessRouter);
app.use("/creator", creatorRouter);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    let decoded;
    let user;

    try {
      decoded = jwt.verify(token, process.env.JWT_CREATOR_SECRET);
      user = await creatorModel.findById(decoded.userId);
      if (user) {
        socket.userType = 'creator';
      }
    } catch (e) {
      try {
        decoded = jwt.verify(token, process.env.JWT_BUSINESS_SECRET);
        user = await businessModel.findById(decoded.userId);
        if (user) {
          socket.userType = 'business';
        }
      } catch (e2) {
        return next(new Error("Authentication error: Invalid token"));
      }
    }

    if (!user) {
      console.error(`User not found for ID: ${decoded?.userId}`);
      return next(new Error("Authentication error: User not found"));
    }

    socket.userId = decoded.userId;
    const creatorName = await creatorModel.findById(decoded.userId);
    socket.username = creatorName.username 
    next();
  } catch (err) {
    console.error("Socket authentication error:", err);
    return next(new Error(`Authentication error: ${err.message}`));
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.username} (${socket.userType}) connected to socket`);

  socket.on("join-room", async ({ room }) => {
    try {
      if (!room) throw new Error("Room code is required");
      
      if (!rooms[room]) {
        rooms[room] = {
          messages: [],
          users: []
        };
      }

      const userInfo = {
        username: socket.username,
        userType: socket.userType
      };
      rooms[room].users.push(userInfo);
      
      socket.join(room);
      
      socket.emit("room-history", {
        messages: rooms[room].messages,
        users: rooms[room].users
      });

      io.to(room).emit("user-joined", userInfo);

      console.log(`${socket.username} (${socket.userType}) joined room ${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: error.message });
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
      socket.emit("error", { message: error.message });
    }
  });

  // Leave Room
  socket.on("leave-room", ({ room }) => {
    try {
      if (!room) throw new Error("Room code is required");

      if (rooms[room]) {
        rooms[room].users = rooms[room].users.filter(
          user => user.username !== socket.username
        );

        socket.leave(room);

        io.to(room).emit("user-left", {
          username: socket.username,
          userType: socket.userType
        });

        console.log(`${socket.username} left room ${room}`);

        if (rooms[room].users.length === 0) {
          delete rooms[room];
        }
      }
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
    
    Object.keys(rooms).forEach(room => {
      if (rooms[room].users.some(user => user.username === socket.username)) {
        rooms[room].users = rooms[room].users.filter(
          user => user.username !== socket.username
        );

        io.to(room).emit("user-left", {
          username: socket.username,
          userType: socket.userType
        });

        // Clean up empty rooms
        if (rooms[room].users.length === 0) {
          delete rooms[room];
        }
      }
    });
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
