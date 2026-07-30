require("dotenv").config();

const http = require("http");
const createApp = require("./createApp");
const initializeSocket = require("./config/socket");

const PORT = Number(process.env.PORT) || 5000;
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

const app = createApp(CLIENT_URL);
const server = http.createServer(app);

initializeSocket(server, CLIENT_URL);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(
      `Sprint 12 chat server listening on port ${PORT}`
    );
    console.log(
      `Accepting client connections from: ${CLIENT_URL}`
    );
  });
}

module.exports = server;