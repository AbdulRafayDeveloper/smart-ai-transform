'use client';
import { useState, useEffect } from 'react';
import "./css/responsive.css"
import "./css/selectionRecolor.css"
const TextToVideo = () => {
  const [text, setText] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const maxWords = 3000;

  const handleGenerateVideo = () => {
    if (text.trim() !== '') {
      setShowVideo(true);
    }
  };

  // useEffect to simulate video rendering when the showVideo state changes
  useEffect(() => {
    if (showVideo) {
      console.log("Video rendering has started...");
    }
  }, [showVideo]);

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen xs:mt-28 md:mt-28 lg:mt-0 custom-margin-top bg-background text-white p-4">
      {/* Tool Heading */}
      <div className="w-3/5 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">🎥 AI Text-to-Video Generator</h2>
        <p className="text-foreground text-lg mb-10 font-medium">
          An AI text-to-image generator turns written descriptions into unique images using advanced artificial intelligence, making it easy to create visuals for design, content, and creative projects directly from text.
        </p>
      </div>

      {/* Text Input Section */}
      <div className="w-full max-w-5xl bg-foreground text-background p-8 rounded-lg shadow-lg">
        <label className="block text-lg mb-2 mt-2">
          Give me a topic, premise, and detailed instructions in any language:
        </label>
        <textarea
          className="w-full text-foreground selected h-32 p-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-foreground outline-none"
          placeholder={`Type your text here... (Max ${maxWords} words)`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {/* Max Word Count Message */}
        <p className="text-gray-400 text-sm mt-2">⚠️ You can enter up to {maxWords} words.</p>

        {/* Generate Button */}
        <button
          onClick={handleGenerateVideo}
          className="mt-4 p-4 bg-background hover:bg-foreground text-foreground hover:text-white border-2 border-white font-bold py-3 rounded-lg transition-all duration-300"
        >
          Generate a video ✨
        </button>
      </div>

      {/* Video Overlay Section */}
      {showVideo && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center">
          <div className="relative w-full max-w-4xl p-6 bg-foreground rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center text-white">Generated Video Preview:</h3>
            <div className="relative w-full">
              <video
                className="w-full h-auto rounded-lg border border-background"
                controls
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Close Button */}
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 p-2 text-white hover:text-red-600"
              >
                ✖
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToVideo;
