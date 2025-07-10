'use client';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContentCopy } from '@mui/icons-material';
import './css/responsive.css';
import Cookies from 'js-cookie';

const VoiceToText = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvertFile = async () => {
    if (!file) {
      toast.error('Please upload an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);

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
      const response = await axios.post('/api/speech-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Response:', response);

      const transcription = response?.data?.data?.transcription;
      if (transcription) {
        setText(transcription);
        toast.success('Text extracted successfully!');
      } else {
        toast.error('No text found in response.');
      }

      setFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error converting audio file.');
      setFile(null);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Text copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy text.');
        console.error('Copy failed:', err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-background px-4 md:px-10 pt-28 pb-32">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80">
          <div className="text-2xl font-semibold text-foreground">Processing...</div>
        </div>
      )}

      <div className="w-3/5 text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-4">🎙️ Voice-to-Text Converter</h2>
        <p className="text-foreground text-lg mb-6 font-medium">
          A voice-to-text converter transcribes spoken words into text using speech recognition.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-foreground p-6 rounded-lg shadow-lg">
        <label className="block text-background text-lg mb-2">Upload an audio file:</label>

        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-foreground bg-white border-2 rounded-lg"
        />
        <button
          onClick={handleConvertFile}
          className="bg-background hover:bg-foreground text-foreground hover:text-background border-2 font-bold py-2 px-4 rounded-lg mt-4 transition-all duration-300"
        >
          🔄 Convert Audio File to Text
        </button>

        {text && (
          <>
            <textarea
              className="w-full h-32 p-4 mt-4 rounded-lg bg-foreground text-white border border-gray-600 outline-none"
              value={text}
              readOnly
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 mt-2 rounded hover:bg-purple-700 transition"
            >
              <ContentCopy />
              Copy Text
            </button>
          </>
        )}
      </div>

      <ToastContainer
        containerId="voiceToText"
        limit={1}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default VoiceToText;
