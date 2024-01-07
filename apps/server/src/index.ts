import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";
(async function init() {
  const socketService = new SocketService();

  await startMessageConsumer();

  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  socketService.initListeners();
})();
