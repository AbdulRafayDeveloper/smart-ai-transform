'use client';
import { useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download } from 'lucide-react';
import "./css/responsive.css";
import "./css/selectionRecolor.css";
import Cookies from 'js-cookie';
import Image from 'next/image';

const TextToImage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadImage = useCallback(() => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.setAttribute('download', 'generated-image.png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [image]);

  const countWords = (str) =>
    str.trim().split(/\s+/).filter(w => w).length;

  const generateImage = async () => {
    const words = countWords(text);
    if (words > 50) {
      toast.error(`Please enter no more than 50 words. You entered ${words}.`);
      return;
    }
    if (!text.trim()) {
      toast.error("Please enter some text to generate an image.");
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

    setLoading(true);
    try {
      const response = await axios.post('/api/text-to-image', { text }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data || !response.data.data || !response.data.data.imagePath) {
        toast.error(response.data.message || 'No imagePath returned from API');
        return;
      }

      const imgPath = response.data.data.imagePath;
      if (imgPath) {
        setImage(imgPath);
        setText("");
        toast.success('Image generated successfully!');
      } else {
        toast.error(response.data.message || 'No imagePath returned from API');
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.message || 'Error generating image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-10 p-4 bg-background">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80">
          <div className="text-2xl font-semibold text-foreground">Processing...</div>
        </div>
      )}

      <div className="w-3/5 text-center md:mt-7">
        <h1 className="text-2xl md:text-3xl font-bold pt-24 text-foreground lg:mb-4 mb-6">
          📄 AI Text-to-Image Generator
        </h1>
        <p className="text-foreground text-lg mb-10 font-medium">
          An AI text-to-image generator turns descriptions into unique images using advanced AI.
        </p>
      </div>

      <div className="shadow-lg rounded-lg p-6 w-full max-w-5xl bg-foreground border-gray-300">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg text-foreground selected"
          placeholder="Enter text to generate image..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        <button
          onClick={generateImage}
          className="mt-4 w-52 mx-auto block py-2 bg-background text-foreground hover:text-background border-2 hover:border-background rounded-lg hover:bg-foreground transition"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {image && (
          <div className="relative mt-6">
            {/* <img src={image} alt="Generated" className="w-full rounded-lg shadow-lg" /> */}
            <Image src={image} alt="logo" width={100} height={100} className="absolute top-2 left-2" />
            <button
              onClick={downloadImage}
              className="absolute top-2 right-2 bg-background bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full"
              title="Download image"
            >
              <Download size={20} />
            </button>
          </div>
        )}
      </div>

      {/* <ToastContainer
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
      /> */}
    </div>
  );
};

export default TextToImage;
