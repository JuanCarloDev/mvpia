"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export default function Home() {
  const [transcription, setTranscription] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Configurar a conexão com o WebSocket
    const socketIo = io();
    setSocket(socketIo);

    // Receber dados de transcrição
    socketIo.on("transcript", (data) => {
      setTranscription(
        (prev) => prev + data.channel.alternatives[0].transcript + "\n"
      );
    });

    // Receber mensagem de fechamento
    socketIo.on("close", (message) => {
      console.log(message);
    });

    // Limpar a conexão ao desmontar o componente
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const startTranscription = async () => {
    if (socket) {
      // Solicitar permissão para acessar o microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      // Enviar dados do áudio para o servidor
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socket.emit("audioStream", event.data);
        }
      };

      mediaRecorder.start(100); // Enviar dados a cada 100 ms

      // Emitir evento para iniciar a transcrição
      socket.emit("startTranscription", {
        apiKey: "db712616fd24c95711de9e5d001d5a5194ad18b6",
      });
    }
  };

  return (
    <div>
      <h1>Deepgram Transcription</h1>
      <button onClick={startTranscription}>Start Transcription</button>
      <pre>{transcription}</pre>
    </div>
  );
}
