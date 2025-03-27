'use client';
import { useState } from 'react';
import "./css/responsive.css"
import "./css/selectionRecolor.css"
const TextToVoice = () => {
  const [text, setText] = useState('');
  const maxWords = 3000;

  const handleTextToSpeech = () => {
    if (text.trim() === '') return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    
    // Automatically select a male voice
    utterance.voice = voices.find((voice) => voice.name.includes('Male')) || voices[0];

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 min-h-screen bg-background  text-foreground shadow-2xl custom-margin-bottom">
      {/* Tool Heading */}
      <div className='w-3/5 xs:mt-28 md:mt-28 lg:mt-0 custom-margin-top '>

      <h2 className="text-3xl font-bold text-center text-foreground mb-3 ">🎙️ AI Text-to-Voice Generator</h2>
      <p className='text-center text-lg mb-10 font-medium'>An AI text-to-voice generator converts written text into natural, human-like speech using advanced artificial intelligence. With customizable voice options, speed, and pitch, it enables seamless integration into applications like virtual assistants, e-learning platforms, and accessibility tools. Perfect for creating engaging content, enhancing user experiences, or providing accessibility solutions.</p>
      </div>
      {/* Input Section */}
      <div className="w-full max-w-5xl bg-foreground p-8 rounded-xl shadow-lg text-background border-gray-300">
        <label className="block text-lg font-medium mb-2">
          Enter text to convert into speech:
        </label>
        <textarea
          className="w-full h-32 p-4 rounded-lg  text-foreground bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-foreground outline-none selected"
          placeholder={`Type your text here... (Max ${maxWords} words)`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {/* Max Word Count Message */}
        <p className="text-background text-sm mt-2">⚠️ You can enter up to {maxWords} words.</p>

        {/* Convert to Voice Button */}
        <button
          onClick={handleTextToSpeech}
          className="mt-4 p-6 bg-background text-foreground font-bold py-3 rounded-lg transition-all duration-300"
        >
          🎧 Convert to Voice
        </button>
      </div>
    </div>
  );
};

export default TextToVoice;
