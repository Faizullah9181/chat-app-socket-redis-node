import { Server } from "socket.io";
import RedisService from "./redis";
import { produceMessage } from "./kafka";

class SocketService {
  private _io: Server;
  protected sub = RedisService.redisInstance;
  protected pub = RedisService.redisInstance;

  constructor() {
    console.log("SocketService");
    this._io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });

    this.sub.subscribe("MESSAGES");
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", JSON.stringify({ message }));

        this.pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    this.sub.on("message", async (channel: any, message: any) => {
      if (channel === "MESSAGES") {
        console.log("new message from redis", message);
        io.emit("message", message);
        await produceMessage(message);
      }
    });
  }
}

export default SocketService;
