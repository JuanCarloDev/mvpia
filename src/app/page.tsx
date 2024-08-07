"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SpeechRecognition from "./components/SpeechRecognition";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white w-full">
      <div className={`max-w-6xl w-full  grid grid-cols-6 gap-4 py-8`}>
        <div className={`col-span-6 w-full flex justify-center mb-12`}>
          <img className={`w-12 opacity-90`} src="/images/infinity.png" />
          {/* <p className={`font-bold text-xl text-black`}>Infinity Inteligence</p> */}
        </div>

        <SpeechRecognition />
        <div
          className={` col-span-6 lg:col-span-2  flex flex-col gap-4 relative`}
        >
          <div
            className={`bg-gradient-to-t from-white to-transparent absolute bottom-0 left-0 w-full h-[50%]`}
          />
          <p className={`font-bold text-lg text-[#556678]`}>Transcript</p>


              {/*<p className={`text-black/50`}>
                Bia: Você já ouviu falar sobre inteligência espiritual? <br />{" "}
                <br />
                Jay: Já, um pouco. É aquela ideia de ir além da inteligência
                emocional, certo? Algo relacionado com propósito e significado na
                vida?
                <br /> <br /> Bia: Exatamente. A inteligência espiritual é a
                capacidade de acessar e aplicar valores e significados mais
                profundos em nossas vidas. Ela nos ajuda a lidar com questões
                existenciais e a encontrar um propósito maior. <br /> <br />
                Jay: Interessante. Isso é como uma junção de filosofia e
                espiritualidade? <br /> <br />
                Bia: De certa forma, sim. Mas também envolve práticas e habilidades
                que nos ajudam a viver de forma mais plena e autêntica. Por exemplo,
                a meditação, a reflexão sobre nossos valores e a conexão com algo
                maior que nós mesmos.
              </p> */}
        </div>
      </div>
    </main>
  );
}
