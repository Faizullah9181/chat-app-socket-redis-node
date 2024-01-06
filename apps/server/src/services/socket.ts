import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService");
    this._io = new Server();
  }

  public initListeners() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", JSON.stringify({ message }));
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
