// import Link from "next/link";

// const Footer = () => {
//   return (
//     <footer className="bg-foreground text-background py-7">
//       <div className="container mx-auto px-6 lg:px-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Logo & Description */}
//           <div className="lg:col-span-2">
//             <Link href="/" className="flex items-center space-x-3">
//               <img src="/img/logo.png" className="h-20 w-20 rounded-full shadow-lg" alt="Logo" />
//             </Link>
//             <p className="mt-6 text-background leading-relaxed">
//               Easily convert, extract, and process a wide variety of media file formats using our user-friendly tools, designed to save you time and effort.
//               Whether you're working with MP4, MP3, WAV, or other formats, enjoy high-quality results and seamless performance tailored for your needs.
//             </p>

//           </div>

//           {/* Information Links
//           <div>
//             <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
//             <ul className="space-y-2">
//               {["Text-to-Video", "Text-to-Voice", "Image-to-Text", "Voice-to-Text"].map((item, index) => (
//                 <li key={index}>
//                   <Link href={`/${item.toLowerCase().replace(/\s/g, '')}`} className="hover:text-indigo-400 transition duration-300">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>


//           <div>
//             <h2 className="text-xl font-bold text-white mb-4">Follow Us</h2>
//             <div className="flex space-x-4">
//               {[
//                 { name: "Twitter", icon: "fa-twitter", link: "#" },
//                 { name: "Whatsapp", icon: "fa-whatsapp", link: "#" },
//                 { name: "Instagram", icon: "fa-instagram", link: "#" },
//                 { name: "Facebook", icon: "fa-facebook", link: "#" }
//               ].map((social, index) => (
//                 <Link key={index} href={social.link} className="text-background hover:text-indigo-400 transition duration-300 text-2xl">
//                   <i className={`fa-brands ${social.icon}`}></i>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div> */}

//           {/* Information Links */}
//           <div>
//             <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
//             <ul className="space-y-2">
//               {["Text-to-Video", "Text-to-Voice", "Image-to-Text", "Voice-to-Text"].map((item, index) => (
//                 <li key={index}>
//                   <Link href={`/${item.toLowerCase().replace(/\s/g, '')}`} className="hover:text-indigo-400 transition duration-300">
//                     {item}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Social Media Links as Column */}
//           <div>
//             <h2 className="text-xl font-bold text-white mb-4">Follow Us</h2>
//             <ul className="space-y-2">
//               {[
//                 { name: "Twitter", icon: "fa-twitter", link: "#" },
//                 { name: "Whatsapp", icon: "fa-whatsapp", link: "#" },
//                 { name: "Instagram", icon: "fa-instagram", link: "#" },
//                 { name: "Facebook", icon: "fa-facebook", link: "#" }
//               ].map((social, index) => (
//                 <li key={index}>
//                   <Link href={social.link} className="flex items-center space-x-2 text-background hover:text-indigo-400 transition duration-300">
//                     <i className={`fa-brands ${social.icon} text-lg`}></i>
//                     <span>{social.name}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>


//           {/* Bottom Section */}
//           <div className="mt-6 border-t border-gray-700 pt-6 text-center">
//             <p className="text-background">© {new Date().getFullYear()} YourCompany. All rights reserved.</p>
//           </div>
//         </div>
//     </footer>
//   );
// };

// export default Footer;

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-7">
      <div className="container mx-auto px-12 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/img/logo.png" className="h-20 w-20 rounded-full shadow-lg" alt="Logo" />
            </Link>
            <p className="mt-6 text-background leading-relaxed">
              Easily convert, extract, and process a wide variety of media file formats using our user-friendly tools, designed to save you time and effort.
              Whether you're working with MP4, MP3, WAV, or other formats, enjoy high-quality results and seamless performance tailored for your needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {["Text-to-Video", "Text-to-Voice", "Image-to-Text", "Voice-to-Text"].map((item, index) => (
                <li key={index}>
                  <Link href={`/${item.toLowerCase().replace(/\s/g, '')}`} className="hover:text-indigo-400 transition duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Column */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Follow Us</h2>
            <ul className="space-y-2">
              {[
                { name: "Twitter", icon: "fa-twitter", link: "#" },
                { name: "Whatsapp", icon: "fa-whatsapp", link: "#" },
                { name: "Instagram", icon: "fa-instagram", link: "#" },
                { name: "Facebook", icon: "fa-facebook", link: "#" }
              ].map((social, index) => (
                <li key={index}>
                  <Link href={social.link} className="flex items-center space-x-2 text-background hover:text-indigo-400 transition duration-300">
                    <i className={`fa-brands ${social.icon} text-lg`}></i>
                    <span>{social.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - This must be outside the grid */}
        <div className="mt-6 border-t border-gray-700 pt-6 text-center">
          <p className="text-background">© {new Date().getFullYear()} YourCompany. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
