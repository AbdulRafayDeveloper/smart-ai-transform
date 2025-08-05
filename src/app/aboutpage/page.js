"use client";
import Image from "next/image";
import { FaUsers, FaStar, FaTools } from "react-icons/fa";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-6">
        {/* Header Section */}
        <div className="text-center mt-20 w-3/5 ">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-foreground text-lg mb-9 font-medium"> <strong>Smart Transform AI</strong> offers a powerful suite of AI tools designed to simplify content creation. With features like converting text from images, transforming text into speech, and generating images from text, we make it easy to bring your ideas to life. Whether you&apos;re looking to digitize content, enhance accessibility, or create custom visuals, our platform provides intuitive, high-quality solutions for all your creative needs.</p>
          <h1 className="mt-2 text-2xl mb-3 font-bold">Discover who we are and what we do</h1>
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto bg-foreground text-background p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaUsers /> Who We Are
          </h2>
          <p className="mt-4 text-lg">
            We are a team of passionate developers creating innovative and
            user-friendly web applications. Our goal is to deliver high-quality
            digital experiences that make life easier.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-background">
          <div className="bg-foreground p-6 rounded-xl shadow-lg text-center">
            <FaStar className="text-4xl text-backgroud mx-auto" />
            <h3 className="text-xl font-bold mt-2">Quality Work</h3>
            <p className="text-background">
              We ensure high standards in all our projects.
            </p>
          </div>
          <div className="bg-foreground p-6 rounded-xl shadow-lg text-center">
            <FaTools className="text-4xl text-background mx-auto" />
            <h3 className="text-xl font-bold mt-2">Innovative Tools</h3>
            <p className="text-background">
              We use the latest technologies to develop top-tier solutions.
            </p>
          </div>
          <div className="bg-foreground p-6 rounded-xl shadow-lg text-center">
            <FaUsers className="text-4xl text-background mx-auto" />
            <h3 className="text-xl font-bold mt-2">Dedicated Team</h3>
            <p className="text-background">
              Our experts are committed to your success.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
