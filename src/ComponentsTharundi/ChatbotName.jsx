


// import React from "react";
// import TurtleIcon from "./turtle.svg"; // Ensure correct path

// const ChatbotName = () => {
//   return (
//     <div className="absolute top-4 right-6 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-lg flex items-center space-x-4">
//       {/* Icon */}
//       <img
//         src={TurtleIcon}
//         alt="Archelon AI Logo"
//         className="w-16 h-16 object-contain"
//       />

//       {/* Text Content */}
//       <div className="flex flex-col">
//         <span className="text-2xl font-bold tracking-tight font-serif">
//           Archelon AI
//         </span>
//         <span className="text-sm text-gray-300 italic">
//           The Wise Coding Companion
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ChatbotName;



import React from "react";
import TurtleIcon from "./turtle.svg";

const ChatbotName = () => {
  return (
    <div className="absolute top-4 right-6 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-white px-5 py-3 rounded-xl shadow-lg flex items-center space-x-4">
      {/* Icon */}
      <img
        src={TurtleIcon}
        alt="Archelon AI Logo"
        className="w-16 h-16 object-contain"
      />

      {/* Text Content */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight font-serif text-slate-100">
          Archelon AI
        </span>
        <span className="text-sm text-slate-400 italic">
          The Wise Coding Companion
        </span>
      </div>
    </div>
  );
};

export default ChatbotName;
