import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HighlightIcon from '@mui/icons-material/Highlight';
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import FlareIcon from '@mui/icons-material/Flare';



const commanPath = "/img/svg/"

// Cards data for Text to Video (SmartVidz)
const CardDataVideo = [
  {
    id: 1,
    image: "/img/svg/text-style-format-svgrepo-com.svg",
    title: "Enter Text",
    content: "Provide the text or script you want to transform into a video.",
  },
  {
    id: 2,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    title: "Select Visuals & Voice",
    content: "Choose AI-generated visuals, voiceovers, and background settings.",
  },
  {
    id: 3,
    image: "/img/svg/plus-cross-svgrepo-com.svg",
    title: "Generate Video",
    content: "Click 'Generate' and let AI convert your text into an engaging video.",
  },
  {
    id: 4,
    image: "https://cdn-icons-png.flaticon.com/512/4436/4436481.png",
    title: "Download & Share",
    content: "Download the AI-generated video and share it anywhere instantly.",
  },
];

// Cards data for Text to Speech (SmartSpeak)
const CardDataAudio = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/1665/1665735.png",
    title: "Enter or Upload Text",
    content: "Type or upload a text file to convert into natural-sounding speech.",
  },
  {
    id: 2,
    image: "/img/svg/chart-pipe-svgrepo-com.svg",
    title: "Select Language & Voice",
    content: "Pick from multiple AI-generated voices and languages.",
  },
  {
    id: 3,
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046841.png",
    title: "Generate Speech",
    content: "Click 'Convert' and instantly hear your text in lifelike speech.",
  },
  {
    id: 4,
    image: "https://cdn-icons-png.flaticon.com/512/2913/2913974.png",
    title: "Download Audio",
    content: "Save your speech as an MP3 file and use it anywhere.",
  },
];

// Cards data for Text Extraction from Image (SmartScan)
const CardDataExtraction = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/1829/1829586.png",
    title: "Upload Image",
    content: "Select an image containing text that you want to extract.",
  },
  {
    id: 2,
    image: "/img/svg/clipboard-svgrepo-com.svg",
    title: "AI Scanning",
    content: "Our AI scans the image and detects the text with high accuracy.",
  },
  {
    id: 3,
    image: "/img/svg/star-svgrepo-com.svg",
    title: "Extract & Preview",
    content: "View the extracted text and make necessary edits.",
  },
  {
    id: 4,
    image: "/img/svg/plus-cross-svgrepo-com.svg",
    title: "Copy or Download",
    content: "Copy the extracted text or download it as a document.",
  },
];

const CardDataVoiceToText = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/3097/3097331.png",
    title: "Record or Upload Audio",
    content: "Upload an audio file or record your voice in real-time.",
  },
  {
    id: 2,
    image: "https://cdn-icons-png.flaticon.com/512/4185/4185198.png",
    title: "AI Transcription",
    content: "Our AI processes the audio and converts speech into text.",
  },
  {
    id: 3,
    image: "/img/svg/shopping-svgrepo-com.svg",
    title: "Text Preview & Editing",
    content: "View and edit the transcribed text as needed.",
  },
  {
    id: 4,
    image: "https://cdn-icons-png.flaticon.com/512/892/892357.png",
    title: "Copy or Download",
    content: "Copy the converted text or download it as a document.",
  },
];



// Featured Cards Data (Updated for Smart Transform AI)
const FeaturedCardData = [
  {
    id: "01",
    type: "Video",
    labelColor: "#4F46E5", // Indigo (Smart Transform AI Theme)
    style: { color: "#22405c" },
    title: "AI-Powered Video Processing",
    content: "Leverage advanced AI to transform text into high-quality videos in seconds.",
  },
  {
    id: "02",
    type: "Audio",
    labelColor: "#9333EA", // Purple (Smart Transform AI Theme)
    style: { color: "#22405c" },
    title: "Crystal-Clear Audio",
    content: "Enhance and clean up audio files effortlessly with AI-powered noise reduction.",
  },
  {
    id: "03",
    type: "Video",
    labelColor: "#2563EB", // Blue (Smart Transform AI Theme)
    style: { color: "#22405c" },
    title: "Seamless Video Editing",
    content: "Cut, merge, and enhance videos without any technical skills required.",
  },
  {
    id: "04",
    type: "Audio",
    labelColor: "#6366F1", // Soft Purple
    style: { color: "#22405c" },
    title: "Auto-Generated Subtitles",
    content: "Convert speech to text with high accuracy and customizable captions.",
  },
  {
    id: "05",
    type: "Video",
    labelColor: "#1E40AF", // Deep Blue
    style: { color: "#22405c" },
    title: "HD Video Output",
    content: "Experience 1080p+ quality rendering for all your video conversions.",
  },

];

export default FeaturedCardData;




const Rewritertooldata = [
  {
    id: 1,
    image: "https://cdn-icons-png.flaticon.com/512/354/354637.png", // Video Icon
    alt: "Video Creators",
    title: "AI-Enhanced Video Editing",
    content:
      "Create high-quality videos effortlessly. Convert, edit, and enhance videos using AI-powered tools for better engagement on any platform.",
  },
  {
    id: 2,
    image: "/img/svg/audio-media-multimedia-21-svgrepo-com.svg", // Audio Converter Icon
    alt: "Audio Editors",
    title: "AI-Powered Audio Optimization",
    content:
      "Improve sound quality, remove background noise, and convert audio into various formats seamlessly with our AI-driven audio tools.",
  },
  {
    id: 3,
    image: "/img/svg/headphones-svgrepo-com.svg", // Podcast Icon
    alt: "Podcasters",
    title: "Effortless Podcast Conversion",
    content:
      "Transform videos into audio podcasts with just one click. AI-driven enhancements ensure crisp sound quality and smooth transitions.",
  },
  {
    id: 4,
    image: "/img/svg/bulb-creative-idea-svgrepo-com.svg", // Audio Recording Icon
    alt: "Music Producers",
    title: "Smart AI for Music Production",
    content:
      "Mix, edit, and refine your music tracks using intelligent audio tools. Convert files and enhance sound quality instantly.",
  },
];

// faqs data video and audio 
const FAQsData = [
  {
    id: 1,
    questionNo: "Q1:",
    question: "How can I create a video from text using Smart Transform?",
    answer: "Simply enter your text, choose a style or visuals, and our AI will instantly generate a high-quality video based on your content."
  },
  {
    id: 2,
    questionNo: "Q2:",
    question: "Can I generate images just from text?",
    answer: "Yes! With our text-to-image tool, you can describe anything in words, and Smart Transform will create stunning, unique images for you in seconds."
  },
  {
    id: 3,
    questionNo: "Q3:",
    question: "Is it possible to convert my text into natural-sounding voice?",
    answer: "Absolutely! Enter your text in the text-to-voice tool, and our AI will generate a clear, professional-sounding audio file for you."
  },
  {
    id: 4,
    questionNo: "Q4:",
    question: "How do I turn my voice recordings into text?",
    answer: "Just upload your voice file in the voice-to-text tool, and Smart Transform will accurately transcribe it into editable text within moments."
  },
  {
    id: 5,
    questionNo: "Q5:",
    question: "Can I extract text from images easily?",
    answer: "Yes! With the image-to-text feature, simply upload any image, and our AI will instantly detect and extract the text for you."
  },
];

export { CardDataVideo, CardDataAudio, CardDataExtraction, CardDataVoiceToText, FeaturedCardData, Rewritertooldata, FAQsData };