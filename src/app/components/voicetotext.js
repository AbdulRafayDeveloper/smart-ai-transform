'use client';
import { useState } from 'react';
import axios from 'axios';
import "./css/responsive.css";

const VoiceToText = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState(null);
  let recognition;

  // Browser-based speech recognition
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript); // Show text when user speaks
    };
  }

  // Start listening from mic
  const handleStartListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    setIsListening(true);
    setText(''); // Clear previous text
    recognition.start();
  };

  // Stop listening
  const handleStopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Convert Audio File to Text (API Call)
  const handleConvertFile = async () => {
    if (!file) {
      alert('Please upload an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1'); // OpenAI Whisper model

    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setText(response.data.text); // Show text when file is transcribed
    } catch (error) {
      console.error('Error converting audio:', error);
      alert('Error converting audio file.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-background px-4 md:px-10 pt-28 md:pt-14 lg:pt-20 xl:pt-28 pb-32">

      {/* Tool Heading */}
      <div className='w-3/5 text-center xs:mt-28 md:mt-28 lg:mt-0 custom-margin-top'>
        <h2 className="text-3xl font-bold text-foreground mb-4">🎙️ Voice-to-Text Converter</h2>
        <p className='text-foreground text-lg mb-10 font-medium'>
          A voice-to-text converter is a tool that transcribes spoken words into written text using speech recognition technology. It captures audio input, processes it through advanced algorithms, and generates accurate text output.
        </p>
      </div>

      {/* Voice Input Section */}
      <div className="w-full max-w-5xl bg-foreground border-gray-300 p-6 rounded-lg shadow-lg">
        <label className="block text-background text-lg mb-2">
          Speak into your microphone or upload an audio file:
        </label>

        {/* Show textarea only if text exists */}
        {text && (
          <textarea
            className="w-full h-32 p-4 rounded-lg bg-foreground text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Your spoken words or transcribed text will appear here..."
            value={text}
            readOnly
            rows={10}
          ></textarea>
        )}

        {/* Buttons for Recording */}
        <div className="flex justify-center gap-4 mt-4">
          {!isListening ? (
            <button
              onClick={handleStartListening}
              className="bg-background hover:bg-foreground text-foreground hover:text-background font-bold py-3 px-6 border-2 border-solid rounded-lg transition-all duration-300"
            >
              🎤 Start Speaking
            </button>
          ) : (
            <button
              onClick={handleStopListening}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              ⏹️ Stop Listening
            </button>
          )}
        </div>

        {/* File Upload */}
        <div className="mt-6">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-foreground bg-white border-2 rounded-lg"
          />
          <button
            onClick={handleConvertFile}
            className="bg-background hover:bg-foreground text-foreground hover:text-background border-2 border-background font-bold py-2 px-4 rounded-lg mt-4 transition-all duration-300"
          >
            🔄 Convert Audio File to Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceToText;
