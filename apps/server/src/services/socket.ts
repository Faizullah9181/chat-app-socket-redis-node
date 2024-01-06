import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({

});
const sub = new Redis({

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
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
