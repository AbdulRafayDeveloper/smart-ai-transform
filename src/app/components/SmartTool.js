import { Rewritertooldata } from "../dataset/data";
import Image from "next/image";

const SmartTool = () => {
  return (
    <div className="container-fluid p-0 mt-4">
      {/* Section Title */}
      <div className="flex justify-center items-center text-center mt-6">
        <div className="w-full sm:w-[600px] lg:w-[800px]">
          <div className="mt-5 w-full lg:max-w-[1320px] mx-auto p-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Who Can Use Our AI-Powered Video & Audio Tools?
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Whether you&apos;re a <strong>content creator</strong>, <strong>podcaster</strong>, <strong>music producer</strong>, or <strong>business professional</strong>,
              our AI-driven video and audio tools help you transform and enhance your media with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mt-12 w-full lg:max-w-[1320px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {Rewritertooldata.map((el, idx) => (
            <div
              key={idx}
              className="p-8 bg-foreground border border-gray-200 rounded-xl shadow-lg  hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className=" xs:flex xs:flex-col items-center justify-center  space-x-6 md:flex md:flex-row">
                {/* <img
                  src={el.image}
                  alt={el.alt}
                  className="w-20 h-20 sm:w-16 sm:h-16"
                /> */}
                <Image src={el.image} alt={el.alt} width={100} height={100} className="w-20 h-20 sm:w-16 sm:h-16" />
                <div>
                  <h5 className="text-2xl font-bold text-background mb-2">{el.title}</h5>
                  <p className="text-lg text-background">{el.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartTool;
