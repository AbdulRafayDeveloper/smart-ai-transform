import React from 'react'
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import GeneratoraudioTool from '../components/speechmaker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AudioConvertor = () => {
  return (
    <>
       <Navbar/>
        <GeneratoraudioTool/>
        <ToastContainer position="top-right" />
       <Footer/>
    </>
  )
}

export default AudioConvertor;
