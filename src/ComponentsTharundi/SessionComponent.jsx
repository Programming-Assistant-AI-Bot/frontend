import React from "react";
import { Trash, PenLine } from "lucide-react";

// const SessionComponent = ({ sessionName }) => {
//   return (
//     <div className="flex justify-between items-center p-2 rounded-lg cursor-pointer hover:bg-[#6B3F8C] group">
//       <span>{sessionName}</span>
//       <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         <PenLine size={14} className="cursor-pointer hover:text-gray-300" />
//         <Trash size={14} className="cursor-pointer hover:text-red-400" />
//       </div>
//     </div>
//   );
// };

// export default SessionComponent;

const SessionComponent = ({ sessionName }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-lg cursor-pointer hover:bg-[#6B3F8C] group transition-colors">
      <span className="text-gray-200">{sessionName}</span>
      <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <PenLine 
          size={18} 
          className="text-purple-300 hover:text-white transition-colors" 
        />
        <Trash 
          size={18} 
          className="text-red-400 hover:text-red-300 transition-colors" 
        />
      </div>
    </div>
  );
};

export default SessionComponent;