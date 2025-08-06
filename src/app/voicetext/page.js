import React from 'react'
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import VoiceToText from '../components/voicetotext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AudioConvertor = () => {
  return (
    <>
       <Navbar/>
       <VoiceToText/>
       <ToastContainer position="top-right" />
       <Footer/>
    </>
  )
}

export default AudioConvertor;
