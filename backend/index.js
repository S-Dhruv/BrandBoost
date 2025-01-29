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
const Todo = require("./models/todoSchema")
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
let todo ={};
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

    // Try to verify as creator first
    try {
      decoded = jwt.verify(token, process.env.JWT_CREATOR_SECRET);
      user = await creatorModel.findById(decoded.userId);
      if (user) {
        socket.userType = 'creator';
      }
    } catch (e) {
      // If creator verification fails, try business token
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

    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.username = user.username;
    
    console.log(`User connected: ${user.username} (${socket.userType})`);
    next();
  } catch (err) {
    console.error("Socket authentication error:", err);
    return next(new Error(`Authentication error: ${err.message}`));
  }
});
io.on("connection", (socket) => {
  console.log(`${socket.username} (${socket.userType}) connected to socket`);

  // Join Room
  socket.on("join-room", async ({ room }) => {
    try {
      if (!room) {
        socket.emit("error-message",{
          status:"404",
          message:"Room code is required"
        });
        
      }

      // Verify room access based on user type
      if (socket.userType === 'business') {
        const job = await jobModel.findOne({ 
          roomCode: room,
          creatorId: socket.userId 
        });
        if (!job) {
          socket.emit("error-message",{
            status:"404",
            message:"Room code is required"
          });
         
        }
      } else if (socket.userType === 'creator') {
        const job = await jobModel.findOne({ 
          roomCode: room,
          appliedCandidates: socket.userId 
        });
        if (!job) {
          socket.emit("error-message",{
            status:"404",
            message:"Room code is required"
          });
          
        }
      }

      // Initialize room if it doesn't exist
      if (!rooms[room]) {
        rooms[room] = {
          messages: [],
          users: []
        };
      }

      // Add user to room
      const userInfo = {
        username: socket.username,
        userType: socket.userType
      };
      rooms[room].users.push(userInfo);
      
      // Join the socket room
      socket.join(room);
      
      // Send room history to joining user
      socket.emit("room-history", {
        messages: rooms[room].messages,
        users: rooms[room].users
      });

      // Notify others in room
      io.to(room).emit("user-joined", userInfo);

      console.log(`${socket.username} (${socket.userType}) joined room ${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: error.message });
    }
  });

  // Send Message
  socket.on("send-message", ({ room, message }) => {
    try {
      if (!room || !message) throw new Error("Room and message are required");

      // Verify user is in room
      if (!socket.rooms.has(room)) {
        throw new Error("Not in room");
      }

      // Create message object
      const messageObj = {
        sender: socket.username,
        content: message,
        userType: socket.userType,
        timestamp: new Date().toISOString()
      };

      // Store message in room history
      if (rooms[room]) {
        rooms[room].messages.push(messageObj);
      }

      // Broadcast message to room
      io.to(room).emit("new-message", messageObj);

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
        // Remove user from room's user list
        rooms[room].users = rooms[room].users.filter(
          user => user.username !== socket.username
        );

        // Leave the socket room
        socket.leave(room);

        // Notify others
        io.to(room).emit("user-left", {
          username: socket.username,
          userType: socket.userType
        });

        console.log(`${socket.username} left room ${room}`);

        // Clean up empty rooms
        if (rooms[room].users.length === 0) {
          delete rooms[room];
        }
      }
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", { message: error.message });
    }
  });
  socket.on("use-todo",({newTask,code})=>{
    try{
      if(!newTask || !code){
        socket.emit("error",{message:"Error with code or task"});
      }
      const todoObj = {
        content: newTask,
        roomCode:code
      }
      if (!todo[code]) {
        todo[code] = {
          messages: [],
          users: []
        };
      }
      
      // Store the todo in the room
      todo[code].messages.push(todoObj);
  
      io.to(code).emit('use-todo', { content: todo[code].messages });
      console.log("Emitting use-todo event:", { content: todo[code].messages });
      console.log(todo[code]);
    } catch (err) {
      console.error(err);
      socket.emit("error", { message: "An error occurred" });
    }
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
    
    // Find and leave all rooms user was in
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
// Routes
// In your POST route
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new todo
app.post('/api/todos', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    roomCode: req.body.roomCode // if you want to associate todos with rooms
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (todo) {
      res.json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
