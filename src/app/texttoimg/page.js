import React from 'react'
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import TextToImage from '../components/texttoimg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AudioConvertor = () => {
  return (
    <>
       <Navbar/>
       <TextToImage/>
       <ToastContainer position="top-right" />
       <Footer/>
    </>
  )
}

export default AudioConvertor;
