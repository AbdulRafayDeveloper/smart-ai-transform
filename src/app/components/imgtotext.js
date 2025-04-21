'use client';
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { CloudUpload } from '@mui/icons-material';
import './css/responsive.css';

const TextExtraction = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setExtractedText(''); // Reset previous text
    }
  };

  const handleExtractText = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const { data } = await Tesseract.recognize(image, 'eng');
      setExtractedText(data.text);
    } catch (error) {
      setExtractedText('Failed to extract text. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground pt-28 md:pt-32 lg:pt-36 px-4 md:px-8 lg:px-16 xl:px-24 pb-32 custom-margin-top-ImageToText">

      {/* Tool Heading */}
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

      {/* Display Image Preview */}
      {image && (
        <div className="mt-6 w-full max-w-lg">
          <img src={image} alt="Uploaded" className="w-full rounded-lg shadow-md" />
          <button
            onClick={handleExtractText}
            className="mt-4 w-full bg-white hover:bg-foreground text-foreground hover:text-background font-bold py-3 border-2 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Extracting Text...' : 'Extract Text 📝'}
          </button>
        </div>
      )}

      {/* Display Extracted Text */}
      {extractedText && (
        <div className="mt-6 w-full max-w-lg bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Extracted Text:</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default TextExtraction;
