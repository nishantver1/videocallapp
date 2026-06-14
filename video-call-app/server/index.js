const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    const numberOfUsers = room ? room.size : 0;

    socket.join(roomId);
     socket.roomId = roomId;

    console.log(socket.id, "joined", roomId);

    if (numberOfUsers > 0) {
      socket.emit("create-offer");
    }
  });

  socket.on("offer", ({ offer, roomId }) => {
    console.log("SERVER: offer");

    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ answer, roomId }) => {
    console.log("SERVER: answer");

    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    console.log("SERVER: ICE");

    socket.to(roomId).emit(
      "ice-candidate",
      candidate
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.roomId) {
    socket.to(socket.roomId).emit("user-left");
  }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});