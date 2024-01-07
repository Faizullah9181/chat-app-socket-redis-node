import { Server } from "socket.io";
import Redis from "ioredis";
import prismaClient from "./prisma";
const pub = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "mypass",
  db: 0, // Defaults to 0
});
const sub = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "mypass",
  db: 0, // Defaults to 0
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", JSON.stringify({ message }));
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis", message);
        io.emit("message", message);
        await prismaClient.message.create({
          data: {
            text: message,
          },
        });
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
