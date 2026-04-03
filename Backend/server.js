const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Or specific allowed origins
    methods: ["GET", "POST"]
  }
});
// Middleware
app.use(express.json());
app.use(cors()); // Crucial for connecting your React app

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/opportunities", require("./routes/opportunities"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/messages", require("./routes/messages"));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room.`);
  });

  socket.on("send_message", (data) => {
    // data should contain { senderId, receiverId, content, etc. }
    socket.to(data.receiverId).emit("receive_message", data);
    // Also notify for unread badge etc
    socket.to(data.receiverId).emit("new_notification", { type: "message", from: data.senderId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
