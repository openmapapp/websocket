import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 3005;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("report-deleted", ({ reportId }) => {
    console.log("Report deleted:", reportId);
    io.emit("report-deleted", { reportId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use(express.json());

app.post("/api/new-report", (req, res) => {
  const newReport = req.body;

  console.log("Recieved new report from Next.js:", newReport);

  io.emit("new-report", newReport);
  console.log("Sent new report to all connected clients");
  res.status(200).json({ success: true });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
