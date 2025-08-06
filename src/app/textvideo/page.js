import React from 'react'
import AiTool from '../components/AItool'
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoConvertor = () => {
  return (
    <>
       <Navbar/>
        <AiTool/>
        <ToastContainer position="top-right" />
       <Footer/>
    </>
  )
}

export default VideoConvertor;
