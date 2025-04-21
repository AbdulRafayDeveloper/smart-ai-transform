"use client";
import { useState } from "react";
import "./css/responsive.css"
import "./css/selectionRecolor.css"
const TextToImage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const generateImage = () => {
    if (!text) return;
    setImage("https://via.placeholder.com/400x300?text=Generated+Image");
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-10 p-4 bg-background">
      <div className="w-3/5 text-center md:mt-7">

        <h1 className="text-2xl md:text-3xl font-bold pt-24 text-foreground lg:mb-4 mb-6">
          📄 AI Text-to-Image Generator
        </h1>
        <p className="text-foreground text-lg mb-10 font-medium">
          An AI text-to-image generator turns written descriptions into unique images using advanced artificial intelligence, making it easy to create visuals for design, content, and creative projects directly from text.
        </p>
      </div>

      <div className="shadow-lg rounded-lg p-6 w-full max-w-5xl bg-foreground border-gray-300">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg text-forground selected"
          placeholder="Enter text to generate image..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4" // Set textarea height to 7 rows
        ></textarea>

        <button
          onClick={generateImage}
          className="mt-4 w-52 mx-auto block py-2 bg-background text-foreground hover:text-background border-2 hover:border-background rounded-lg hover:bg-foreground transition"
        >
          Generate Image
        </button>

        {image && (
          <div className="mt-6">
            <img src={image} alt="Generated" className="w-full rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToImage;
