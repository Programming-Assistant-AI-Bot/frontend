// import React from "react";
// import TurtleIcon from "./turtle.svg"; // Import the SVG file

// const ChatbotName = () => {
//   return (
//     <div className="absolute top-2 right-4  text-white px-4 py-1.5 pt-0  rounded-lg shadow-lg flex items-end gap-4">
//       {/* Turtle Icon on the left */}
//       <img src={TurtleIcon} alt="Turtle Icon" className="w-20 h-20 self-start" />

//       {/* Text Section on the right */}
//       <div className="flex flex-col justify-end">
//         <div className="text-3xl font-semibold font-[lora] leading-tight">Archelon AI</div>
//         <div className="text-xs font-light text-gray-300">The Wise Coding Companion</div>
//       </div>
//     </div>
//   );
// };

// export default ChatbotName;


import React from "react";
import TurtleIcon from "./turtle.svg"; // Ensure correct path

const ChatbotName = () => {
  return (
    <div className="absolute top-4 right-6 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-lg flex items-center space-x-4">
      {/* Icon */}
      <img
        src={TurtleIcon}
        alt="Archelon AI Logo"
        className="w-16 h-16 object-contain"
      />

      {/* Text Content */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight font-serif">
          Archelon AI
        </span>
        <span className="text-sm text-gray-300 italic">
          The Wise Coding Companion
        </span>
      </div>
    </div>
  );
};

export default ChatbotName;



