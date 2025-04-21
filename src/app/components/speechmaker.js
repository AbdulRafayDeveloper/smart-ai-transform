'use client';
import { useState, useEffect } from 'react';
import "./css/responsive.css";
import "./css/selectionRecolor.css";

const TextToVoice = () => {
  const [text, setText] = useState('');
  const maxWords = 3000;

  const handleTextToSpeech = () => {
    if (text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    utterance.voice = voices.find((voice) => voice.name.includes('Male')) || voices[0];

    speechSynthesis.speak(utterance);
  };

  // Re-fetch voices if needed
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background text-foreground px-4 md:px-10 pt-36 pb-32">


      {/* Tool Heading */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          🎙️ AI Text-to-Voice Generator
        </h2>
        <p className="text-base md:text-lg font-medium">
          An AI text-to-voice generator converts written text into natural, human-like speech using advanced artificial intelligence. With customizable voice options, speed, and pitch, it enables seamless integration into applications like virtual assistants, e-learning platforms, and accessibility tools. Perfect for creating engaging content, enhancing user experiences, or providing accessibility solutions.
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full bg-foreground p-6 md:p-8 rounded-xl shadow-lg text-background border border-gray-300">
        <label className="block text-base md:text-lg font-medium mb-2">
          Enter text to convert into speech:
        </label>
        <textarea
          className="w-full h-32 p-4 rounded-lg text-foreground bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-foreground outline-none selected"
          placeholder={`Type your text here... (Max ${maxWords} words)`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <p className="text-background text-sm mt-2">⚠️ You can enter up to {maxWords} words.</p>

        <button
          onClick={handleTextToSpeech}
          className="mt-6 w-full md:w-auto bg-background text-foreground border border-white font-bold py-3 px-6 rounded-lg hover:bg-foreground hover:text-white transition-all duration-300"
        >
          🎧 Convert to Voice
        </button>
      </div>
    </div>
  );
};

export default TextToVoice;
