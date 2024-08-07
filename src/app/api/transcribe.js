import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import fetch from "cross-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { deepgramApiKey, audioUrl } = req.body;

  if (!deepgramApiKey || !audioUrl) {
    res.status(400).json({ message: "Missing parameters" });
    return;
  }

  const deepgram = createClient(deepgramApiKey);

  const connection = deepgram.listen.live({
    punctuate: true,
    model: "nova-2",
    language: "pt-BR",
  });

  connection.on(LiveTranscriptionEvents.Open, () => {
    console.log("Connection opened");

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      console.dir(data, { depth: null });
      // Aqui você pode enviar a transcrição para o cliente via WebSocket ou outro método
    });

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.dir(data, { depth: null });
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("Connection closed.");
    });

    fetch(audioUrl)
      .then((r) => r.body)
      .then((res) => {
        res.on("readable", () => {
          connection.send(res.read());
        });
      });
  });

  res.status(200).json({ message: "Transcription started" });
}
