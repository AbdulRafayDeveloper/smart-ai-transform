"use client";
import { ToastContainer } from 'react-toastify';
import Featured from "./components/featured";
import AiTool from "./components/SmartTool";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Questions from "./components/question";
import Homepagesection from "./components/homePage";

const Index = () => {
  return (
    <>
      <Navbar />
      <Homepagesection />
      <Featured />
      <AiTool />
      <Questions />
      <Footer />
    </>
  );
};
export default Index;
