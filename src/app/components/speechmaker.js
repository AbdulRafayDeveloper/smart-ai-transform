'use client';
import { useState, useEffect } from 'react';
import "./css/responsive.css";
import "./css/selectionRecolor.css";
import axios from 'axios';
import { WorkOutlined } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const TextToVoice = () => {
  const [text, setText] = useState('');
  const [voicePath, setVoicePath] = useState('');
  const [loading, setLoading] = useState(false);
  const maxWords = 500;

  // Count words in the text
  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleTextToSpeechDownload = async () => {
    if (voicePath.trim() === '') return;

    try {
      const response = await axios.get(voicePath, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'text-to-speech.mp3');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading voice:', error);
      alert('Failed to download voice. Please try again.');
    }
  };

  const handleTextToSpeech = async () => {
    if (text.trim() === '') return;

    const wordCount = countWords(text);
    if (wordCount > maxWords) {
      toast.error(`Please enter a maximum of ${maxWords} words.`);
      return;
    }

    // check that user is login or not
    const token = Cookies.get('access_token');

    if (!token) {
      toast.error('You are not logged in. Please log in to continue.');
      return;
    }

    // check that user role is user or admin

    const userRole = Cookies.get('user_role');

    if (userRole !== 'user') {
      toast.error('You are not a user. Please log in as a user to continue.');
      return;
    }

    try {
      setLoading(true);
      setVoicePath('');
      const response = await axios.post('/api/text-to-speech', { text }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = response.data;
      setVoicePath(data.data.voicePath);

      if (data?.status === true && data?.data?.voicePath) {
        const audio = new Audio(data.data.voicePath);
        audio.play();
      } else {
        toast.success(data?.message);
      }

    } catch (error) {
      console.error('Error generating voice:', error);
      alert('Failed to generate voice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background text-foreground px-4 md:px-10 pt-36 pb-32">

      {/* Centered Processing Message */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80">
          <div className="text-2xl font-semibold text-foreground">Processing...</div>
        </div>
      )}

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

        <p className="text-background text-sm mt-2">
          ⚠️ {countWords(text)} / {maxWords} words used.
        </p>


        {/* <p className="text-background text-sm mt-2">⚠️ You can enter up to {maxWords} words.</p> */}

        <button
          onClick={handleTextToSpeech}
          className="mt-6 w-full md:w-auto bg-background text-foreground border border-white font-bold py-3 px-6 rounded-lg hover:bg-foreground hover:text-white transition-all duration-300"
        >
          🎧 Convert to Voice
        </button>

        {/* Show Download Button only if voice is ready */}
        <button
          onClick={handleTextToSpeechDownload}
          className="mt-6 ml-5 w-full md:w-auto bg-background text-foreground border border-white font-bold py-3 px-6 rounded-lg hover:bg-foreground hover:text-white transition-all duration-300 disabled:opacity-[0.7] disabled:hover:bg-background disabled:hover:text-foreground"
          disabled={!voicePath}
        >
          ⬇️ Download Voice
        </button>
      </div>
    </div>
  );
};

export default TextToVoice;