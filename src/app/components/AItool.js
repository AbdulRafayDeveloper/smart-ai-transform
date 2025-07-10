// 'use client';

// import { useState, useEffect } from 'react';
// import './css/responsive.css';
// import './css/selectionRecolor.css';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const TextToVideo = () => {
//   const [text, setText] = useState('');
//   const [videoUrl, setVideoUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const maxWords = 3000;

//   const handleGenerateVideo = async () => {
//     if (text.trim() === '') return;

//     // check that user is login or not
//     const token = Cookies.get('access_token');

//     if (!token) {
//       toast.error('You are not logged in. Please log in to continue.');
//       return;
//     }

//     // check that user role is user or admin

//     const userRole = Cookies.get('user_role');

//     if (userRole !== 'user') {
//       toast.error('You are not a user. Please log in as a user to continue.');
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append('text', text);

//       const response = await axios.post('/api/text-to-video', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       console.log("response 1: ", response);
//       console.log('Response 2:', response.data);
//       console.log('Response 3:', response.data.data);
//       console.log('Response 4:', response.data.data?.videoPath);

//       const videoPath = response.data.data?.videoPath;
//       console.log('Video Path:', videoPath);

//       if (videoPath) {
//         setVideoUrl(videoPath);
//       } else {
//         alert('Video generation failed.');
//       }
//     } catch (error) {
//       console.error('Error generating video:', error);
//       alert('An error occurred while generating the video.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (videoUrl) {
//       console.log('Video rendering has started...');
//     }
//   }, [videoUrl]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white px-4 md:px-8 xl:px-12 2xl:px-24 pt-32">
//       <ToastContainer
//         position="top-right"
//       />
//       {/* Heading */}
//       <div className="w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl text-center">
//         <h2 className="text-xl md:text-xl xl:text-2xl font-bold text-foreground mb-6">
//           🎥 AI Text-to-Video Generator
//         </h2>
//         <p className="text-foreground text-lg md:text-xl xl:text-2xl mb-10 font-medium">
//           An AI text-to-video generator turns written descriptions into unique motion visuals using advanced artificial intelligence. It helps you quickly turn ideas into media.
//         </p>
//       </div>

//       {/* Input Area */}
//       <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-foreground text-background p-6 sm:p-8 xl:p-10 rounded-lg shadow-lg mb-24">
//         <label className="block text-base sm:text-lg xl:text-xl mb-2 mt-2">
//           Give me a topic, premise, and detailed instructions in any language:
//         </label>
//         <textarea
//           className="w-full text-foreground selected h-32 p-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-foreground outline-none"
//           placeholder={`Type your text here... (Max ${maxWords} words)`}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         ></textarea>

//         <p className="text-gray-400 text-sm mt-2">⚠️ You can enter up to {maxWords} words.</p>

//         <button
//           onClick={handleGenerateVideo}
//           disabled={loading}
//           className="mt-4 bg-background hover:bg-foreground text-foreground hover:text-white border-2 border-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
//         >
//           {loading ? 'Generating...' : 'Generate a video ✨'}
//         </button>
//       </div>

//       {/* Video Preview Modal */}
//       {videoUrl && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center p-4">
//           <div className="relative w-full max-w-4xl xl:max-w-6xl bg-foreground p-6 rounded-lg shadow-2xl">
//             <h3 className="text-lg md:text-xl font-semibold mb-4 text-center text-white">
//               Generated Video Preview:
//             </h3>
//             <div className="relative w-full">
//               <video className="w-full h-auto rounded-lg border border-background" controls>
//                 <source src={videoUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               <button
//                 onClick={() => setShowVideo(false)}
//                 className="absolute top-2 right-2 text-white hover:text-red-600 text-2xl"
//               >
//                 ✖
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TextToVideo;

'use client';

import { useState } from 'react';
import './css/responsive.css';
import './css/selectionRecolor.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TextToVideo = () => {
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const maxWords = 3000;

  const handleGenerateVideo = async () => {
    if (text.trim() === '') return;

    const token = Cookies.get('access_token');
    if (!token) {
      toast.error('You are not logged in. Please log in to continue.');
      return;
    }

    const userRole = Cookies.get('user_role');
    if (userRole !== 'user') {
      toast.error('You are not a user. Please log in as a user to continue.');
      return;
    }

    try {
      setLoading(true);
      setVideoReady(false);
      setVideoUrl('');

      const response = await axios.post('/api/text-to-video', { text }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const videoPath = response.data.data?.videoPath;
      if (videoPath) {
        setVideoUrl(videoPath);
        setVideoReady(true);
      } else {
        alert('Video generation failed.');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      alert('An error occurred while generating the video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white px-4 md:px-8 xl:px-12 2xl:px-24 pt-32">
      <ToastContainer position="top-right" />

      {/* Heading */}
      <div className="w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl text-center">
        <h2 className="text-xl md:text-xl xl:text-2xl font-bold text-foreground mb-6">
          🎥 AI Text-to-Video Generator
        </h2>
        <p className="text-foreground text-lg md:text-xl xl:text-2xl mb-10 font-medium">
          An AI text-to-video generator turns written descriptions into unique motion visuals using advanced artificial intelligence. It helps you quickly turn ideas into media.
        </p>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl bg-foreground text-background p-6 sm:p-8 xl:p-10 rounded-lg shadow-lg mb-24">
        <label className="block text-base sm:text-lg xl:text-xl mb-2 mt-2">
          Give me a topic, premise, and detailed instructions in any language:
        </label>
        <textarea
          className="w-full text-foreground selected h-32 p-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-foreground outline-none"
          placeholder={`Type your text here... (Max ${maxWords} words)`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <p className="text-gray-400 text-sm mt-2">⚠️ You can enter up to {maxWords} words.</p>

        <button
          onClick={handleGenerateVideo}
          disabled={loading}
          className="mt-4 bg-background hover:bg-foreground text-foreground hover:text-white border-2 border-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          {loading ? 'Generating...' : 'Generate a video ✨'}
        </button>
      </div>

      {/* Video Overlay Modal */}
      {videoUrl && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-foreground p-6 rounded-lg shadow-2xl text-center">
            <h3 className="text-lg md:text-xl font-semibold mb-6 text-white">
              🎬 Your video is ready to download!
            </h3>

            {/* Disabled or enabled button */}
            <a
              href={videoUrl}
              download
              className={`inline-block px-6 py-3 rounded-lg font-bold border-2 transition-all duration-300
                ${videoReady ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}
              `}
              onClick={(e) => {
                if (!videoReady) e.preventDefault();
              }}
            >
              {videoReady ? 'Download Video 🎥' : 'Preparing...'}
            </a>

            {/* Close button */}
            <button
              onClick={() => {
                setVideoUrl('');
                setVideoReady(false);
              }}
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-600"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToVideo;
