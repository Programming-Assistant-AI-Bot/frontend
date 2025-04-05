import React from "react";
import TurtleIcon from "./turtle.svg"; // Import the SVG file

const ChatbotName = () => {
  return (
    <div className="absolute top-2 right-4  text-white px-4 py-1.5 pt-0  rounded-lg shadow-lg flex items-end gap-4">
      {/* Turtle Icon on the left */}
      <img src={TurtleIcon} alt="Turtle Icon" className="w-20 h-20 self-start" />

      {/* Text Section on the right */}
      <div className="flex flex-col justify-end">
        <div className="text-3xl font-semibold font-[lora] leading-tight">Archelon AI</div>
        <div className="text-xs font-light text-gray-300">The Wise Coding Companion</div>
      </div>
    </div>
  );
};

export default ChatbotName;



