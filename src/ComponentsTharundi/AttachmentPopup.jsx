// import React from 'react';

// const AttachmentPopup = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-black/20 flex justify-center items-center z-50"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-white rounded-lg w-64 shadow-xl overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Options List */}
//         <div className="py-2">
//           <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
//             <div className="flex items-center">
//               <span className="text-gray-700 font-medium">Attach a Repository Link</span>
//             </div>
//           </button>
          
//           <div className="border-t border-gray-100"></div>
          
//           <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
//             <div className="flex items-center">
//               <span className="text-gray-700 font-medium">Add a Website URL</span>
//             </div>
//           </button>
          
//           <div className="border-t border-gray-100"></div>
          
//           <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
//             <div className="flex items-center">
//               <span className="text-gray-700 font-medium">Upload a PDF File</span>
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttachmentPopup;

import React, { useEffect } from 'react';

const AttachmentPopup = ({ isOpen, onClose, onAttachTypeSelect }) => {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleAction = (type) => {
    onClose();
    onAttachTypeSelect(type);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-lg w-80 shadow-2xl transform transition-all overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="divide-y divide-gray-100">
          <button 
            className="w-full px-6 py-4 hover:bg-gray-50 focus:bg-gray-50 transition-colors text-left rounded-t-lg"
            onClick={() => handleAction('repository')}
          >
            <span className="text-gray-900 font-medium">Attach a Repository Link</span>
            <p className="text-sm text-gray-500 mt-1">Connect to GitHub or GitLab</p>
          </button>
          
          <button 
            className="w-full px-6 py-4 hover:bg-gray-50 focus:bg-gray-50 transition-colors text-left"
            onClick={() => handleAction('website')}
          >
            <span className="text-gray-900 font-medium">Add a Website URL</span>
            <p className="text-sm text-gray-500 mt-1">Link to any web resource</p>
          </button>
          
          <button 
            className="w-full px-6 py-4 hover:bg-gray-50 focus:bg-gray-50 transition-colors text-left rounded-b-lg"
            onClick={() => handleAction('pdf')}
          >
            <span className="text-gray-900 font-medium">Upload a PDF File</span>
            <p className="text-sm text-gray-500 mt-1">Max file size 25MB</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentPopup;