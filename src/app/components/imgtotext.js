'use client';
import { useState } from 'react';
import axios from 'axios';
import { CloudUpload, ContentCopy } from '@mui/icons-material';
import './css/responsive.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Image from 'next/image';

const TextExtraction = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setExtractedText('');
    }
  };

  const handleExtractText = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

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

    setLoading(true);
    try {
      const response = await axios.post('/api/image-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const { data } = response.data;
        setExtractedText(data.description || 'No text found in the image.');
        toast.success('Text extracted successfully!'); // ✅ Correct place to call it
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText('Failed to extract text. Try again.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground pt-28 md:pt-32 lg:pt-36 px-4 md:px-8 lg:px-16 xl:px-24 pb-32 custom-margin-top-ImageToText">

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80">
          <div className="text-2xl font-semibold text-foreground">Processing...</div>
        </div>
      )}

      <div className="w-full max-w-4xl text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-6">📄 AI Image-to-Text Converter</h2>
        <p className="text-foreground text-lg font-medium">
          An AI text-to-image generator turns written descriptions into unique images using advanced artificial intelligence, making it easy to create visuals for design, content, and creative projects directly from text.
        </p>
      </div>

      {/* Upload Box */}
      <div className="w-full max-w-5xl bg-foreground p-8 rounded-xl shadow-lg text-gray-900 flex flex-col items-center border-2 border-gray-300">
        <CloudUpload className="text-background" style={{ fontSize: 80 }} />
        <p className="text-background mt-3">Drag and drop images here</p>
        <p className="text-background text-sm">Files supported: JPG | PNG | JPEG | GIF | JFIF</p>

        {/* Upload Button */}
        <label className="mt-4 w-full max-w-xs bg-white hover:bg-foreground text-foreground hover:text-background font-bold py-3 px-6 border rounded-lg text-center cursor-pointer">
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      {image && (
        <div className="mt-6 w-full max-w-lg">
          {/* <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-full rounded-lg shadow-md" /> */}
          <Image
            src={URL.createObjectURL(image)}
            alt="output"
            width={500} // ✅ set actual width
            height={500} // ✅ set actual height
            className="rounded"
          />

          <button
            onClick={handleExtractText}
            className="mt-4 w-full bg-white hover:bg-foreground text-foreground hover:text-background font-bold py-3 border-2 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Extracting Text...' : 'Extract Text 📝'}
          </button>
        </div>
      )}

      {/* {extractedText && (
        <div className="mt-6 w-full max-w-lg bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Extracted Text:</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{extractedText}</p>
        </div>
      )} */}
      {extractedText && (
        <div className="mt-6 w-full max-w-lg bg-white p-6 rounded-lg shadow-md border border-gray-300 relative">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-between">
            Extracted Text
            <ContentCopy
              className="cursor-pointer text-gray-600 hover:text-gray-900 ml-2"
              onClick={handleCopy}
            />
          </h3>
          <p className="text-gray-800 whitespace-pre-wrap">{extractedText}</p>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default TextExtraction;
