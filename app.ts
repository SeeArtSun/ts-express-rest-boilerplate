import bodyParser from "body-parser";
import express from "express";
import http from "http";
import SocketIO from "socket.io";

import users from "./api/v1/users";
import authorization from "./api/v1/authorization";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();
app.use("/api/v1", router);
/**
 * MiddleWare for jwt Authorization
 */
// router.use(authorization);
router.use(users);

app.get("/", (_, res) => {
  res.sendStatus(200);
});

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", socket => {
  console.warn("connected!", socket.id);

  socket.on("subscribe", (payload: { userID: string; channel: string }) => {
    socket.join(payload.channel);

    console.log(`${payload.userID} subscribe ${payload.channel}`);
  });

  socket.on("joinChatRoom", (payload: { userID: string; channel: string }) => {
    socket.join(payload.channel);

    socket.broadcast.emit("sendMessage", {
      channel: payload.channel,
      message: `enter the '${payload.userID}'`
    });
  });

  socket.on(
    "sendMessage",
    (payload: { chatRoomID: string; message: string; senderID?: string }) => {
      const { chatRoomID } = payload;

      io.sockets.in(chatRoomID).emit("sendMessage", payload);
    }
  );

  socket.on("disconnect", function() {
    console.log("disconnected!", socket.id);
  });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
