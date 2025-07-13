


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const RepositoryPopup = ({ isOpen, onClose, onSubmit }) => {
//   const [repoUrl, setRepoUrl] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const handleEscape = (e) => {
//         if (e.key === 'Escape') onClose();
//       };
//       document.addEventListener('keydown', handleEscape);
//       return () => document.removeEventListener('keydown', handleEscape);
//     }
//   }, [isOpen, onClose]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');

//     // Client-side validation with GitHub-specific regex
//     const GITHUB_REPO_REGEX = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/;
//     const isValidFormat = GITHUB_REPO_REGEX.test(repoUrl);

//     if (!isValidFormat) {
//       setErrorMessage('Invalid GitHub URL format. Expected: https://github.com/owner/repo');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post('http://localhost:8000/session/validateGithubUrl', { link: repoUrl });
      
//       if (response.data.valid) {
//         await onSubmit(repoUrl);
//         onClose();
//       } else {
//         setErrorMessage(response.data.reason || 'URL validation failed');
//       }
//     } catch (error) {
//       if (error.response) {
//         setErrorMessage(error.response.data?.reason || 'GitHub validation failed');
//       } else if (error.request) {
//         setErrorMessage('Server not responding. Please try again later.');
//       } else {
//         setErrorMessage('An unexpected error occurred.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

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
//         className="bg-white rounded-lg w-96 shadow-2xl transform transition-all overflow-hidden"
//         style={{ animation: 'slideUp 0.2s ease-out' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <form onSubmit={handleSubmit}>
//           <div className="p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Add Repository Link</h3>
            
//             <div className="space-y-4">
//               <input
//                 type="url"
//                 value={repoUrl}
//                 onChange={(e) => {
//                   setRepoUrl(e.target.value);
//                   setErrorMessage('');
//                 }}
//                 placeholder="https://github.com/username/repo"
//                 className={`w-full px-4 py-2 border ${
//                   errorMessage ? 'border-red-500' : 'border-gray-300'
//                 } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                 autoFocus
//                 required
//               />
              
//               {errorMessage && (
//                 <p className="text-sm text-red-500">
//                   {errorMessage}
//                 </p>
//               )}

//               <div className="flex justify-end space-x-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#6d1785] text-white hover:bg-[#3f144b] rounded-lg transition-colors disabled:opacity-50"
//                   disabled={isSubmitting || !repoUrl.trim()}
//                 >
//                   {isSubmitting ? 'Adding...' : 'Add Repository'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RepositoryPopup;     









import React, { useState, useEffect } from 'react';
import axiosWithAuth from '@/utils/axiosWithAuth';

const RepositoryPopup = ({ isOpen, onClose, onSubmit, sessionId }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!repoUrl.trim()) {
      setErrorMessage('Please enter a GitHub repository URL');
      return;
    }

    setIsSubmitting(true);
    try {
      // Use authenticated axios instance
      const response = await axiosWithAuth().post(
        '/validate/Contents/validateGithubUrl',
        { link: repoUrl, session_id: sessionId }
      );

      if (response.data.valid) {
        await onSubmit(repoUrl);
        onClose(); // Close popup on success
      } else {
        setErrorMessage(response.data.reason || 'Repository validation failed');
      }
    } catch (error) {
      console.error('Repository validation error:', error);
      
      if (error.response?.data?.reason) {
        setErrorMessage(error.response.data.reason);
      } else if (error.request) {
        setErrorMessage('Server not responding. Please try again later.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
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
      aria-labelledby="repository-popup-title"
    >
      <div 
        className="bg-white rounded-lg w-96 shadow-2xl transform transition-all overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 id="repository-popup-title" className="text-lg font-medium text-gray-900 mb-4">
              Add Repository Link
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="repo-input" className="sr-only">Repository URL</label>
                <input
                  id="repo-input"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="https://github.com/username/repo"
                  className={`w-full px-4 py-2 border ${
                    errorMessage ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  autoFocus
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {errorMessage && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6d1785] text-white hover:bg-[#3f144b] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSubmitting || !repoUrl.trim()}
                >
                  {isSubmitting ? 'Validating...' : 'Add Repository'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default RepositoryPopup;