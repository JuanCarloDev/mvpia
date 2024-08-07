const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const socketIo = require("socket.io");
const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const fetch = require("cross-fetch");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("startTranscription", async ({ apiKey }) => {
      const deepgram = createClient(apiKey);
      const connection = deepgram.listen.live({
        punctuate: true,
        model: "nova-2",
        language: "pt-BR",
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Connection opened");

        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
          socket.emit("transcript", data);
        });

        connection.on(LiveTranscriptionEvents.Metadata, (data) => {
          socket.emit("metadata", data);
        });

        connection.on(LiveTranscriptionEvents.Close, () => {
          console.log("Connection closed.");
          socket.emit("close", "Connection closed.");
        });

        socket.on("audioStream", (audioData) => {
          connection.send(audioData);
        });
      });
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
