// import React, {useEffect} from 'react';

// const Repositorypopup = ({isOpen, onClose}) => {
//   useEffect(() => {
//     if (isOpen) {
//       const handleEscape = (e) => {
//         if (e.key === 'Escape') onClose();
//       };
//       document.addEventListener('keydown', handleEscape);
//       return () => document.removeEventListener('keydown', handleEscape);
//     }
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;


//   return (
//     <div 
//       className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
//       style={{ animation: 'fadeIn 0.2s ease-out' }}
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div 
//         className="bg-white rounded-lg w-80 shadow-2xl transform transition-all overflow-hidden"
//         style={{ animation: 'slideUp 0.2s ease-out' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="divide-y divide-gray-100">
//           <button 
//             className="w-full px-6 py-4 hover:bg-gray-50 focus:bg-gray-50 transition-colors text-left rounded-t-lg"
//           >
//             <span className="text-gray-900 font-medium">Attach a Repository Link</span>
//             <p className="text-sm text-gray-500 mt-1">Paste the Link here</p>
//             <input type="text" name="Repository Link">...</input>
//           </button>
          
          
//         </div>
//       </div>
//     </div>
//   );

// }

// export default Repositorypopup;

import React, { useState, useEffect } from 'react';

const RepositoryPopup = ({ isOpen, onClose, onSubmit }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const validateUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(github|gitlab)\.com\/.+/i;
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidUrl = validateUrl(repoUrl);
    setIsValid(isValidUrl);
    
    if (isValidUrl) {
      setIsSubmitting(true);
      try {
        await onSubmit(repoUrl);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    }
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
        className="bg-white rounded-lg w-96 shadow-2xl transform transition-all overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Repository Link</h3>
            
            <div className="space-y-4">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setIsValid(true);
                }}
                placeholder="https://github.com/username/repo"
                className={`w-full px-4 py-2 border ${
                  isValid ? 'border-gray-300' : 'border-red-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoFocus
                required
              />
              
              {!isValid && (
                <p className="text-sm text-red-500">
                  Please enter a valid GitHub or GitLab repository URL
                </p>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6d1785] text-white hover:bg-[#3f144b] rounded-lg transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !repoUrl.trim()}
                >
                  {isSubmitting ? 'Adding...' : 'Add Repository'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepositoryPopup;