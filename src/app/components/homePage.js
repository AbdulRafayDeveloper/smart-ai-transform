import Card from "./card";
import Link from "next/link";
import "../components/css/homePageAnimation.css"
const Homepagesection = () => {
  return (
    <>
      {/* Section 1 */}
      <section className="relative h-screen flex flex-col justify-center bg-[url('/img/background.jpg')] bg-cover bg-center ">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center">
          {/* Left: Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left px-6 md:px-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-text-reveal">
              <span className="line line-1">AI-Powered</span>
              <span className="line line-2">SmartTransform</span>
              <span className="line line-3">Tools</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-foreground mb-9 animate-text-reveal-paragraph">
              Unlock the power of AI with SmartTransform. Convert text into
              speech, generate stunning AI-powered videos, and extract text from
              images with precision. Our advanced tools offer seamless, fast, and
              accurate transformations for content creators, businesses, and
              professionals.
            </p>
            <Link href="/" className="py-4 px-6 bg-foreground text-background rounded-lg shadow-lg text-sm">Reister Now</Link>
          </div>

          {/* Right: Image */}
          <div className="lg:w-1/2 flex justify-center items-center mt-9">
            <img src="/img/bg1.jpg" alt="AI Tools" className="w-full max-w-[80%] rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Section 2 & 3: Cards */}
      <div className="container-fluid p-0">
        <div className="flex flex-col mt-2 w-full lg:max-w-[1320px] mx-auto">
          <Card />
        </div>
      </div>
    </>
  );
};

export default Homepagesection;
