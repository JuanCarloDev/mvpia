import React, { useState, useEffect, useRef, useCallback } from "react";

export function SpeechRecognition() {
  var ongoing = false;
  var recognition = null;
  const wordsRef = (useRef < HTMLDivElement) | (null > null);

  function verificaStatus() {
    if (ongoing == true) {
      recognition.start();
    }
  }

  function init() {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "pt-BR";

    var p = document.createElement("span");
    const words = document.querySelector(".words");
    words.appendChild(p);

    recognition.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      p.textContent = transcript + ", ";
      if (e.results[0].isFinal) {
        p = document.createElement("span");
        words.appendChild(p);
      }
    });
    recognition.addEventListener("end", verificaStatus);
    recognition.start();
  }

  function doStartStopCheck() {
    if (ongoing == true) {
      // se tiver rodando, vai interromper
      ongoing = false;
      recognition.stop();
      document.getElementById("btn_speech").innerHTML = "Transcrever Áudio";
    } else if (recognition) {
      // se tiver instância SpeechRecognition, apenas reinicia
      ongoing = true;
      recognition.start();
      document.getElementById("btn_speech").innerHTML = "Interromper";
    } else {
      // se ainda não criou instância, chama a função para inicialização
      console.log("init");
      ongoing = true;
      init();
      document.getElementById("btn_speech").innerHTML = "Interromper";
    }
  }

  function rolaScroll() {
    const w = document.querySelector(".words");
    w.scrollTop = w.scrollHeight;
  }

  setInterval(rolaScroll, 1000);

  return (
    <div>
      <button id="btn_speech" onClick={doStartStopCheck}>
        {ongoing ? "Interromper" : "Transcrever Áudio"}
      </button>
    </div>
  );
}
