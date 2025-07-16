
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import sonner from 'sonner'

// const WeburlPopup = ({ isOpen, onClose, onSubmit,sessionId }) => {
//   const [url, setUrl] = useState('');
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
    
//     try {
    
//       new URL(url);
//     } catch (error) {
//       setErrorMessage('Please enter a valid website URL (e.g., https://example.com)');
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       const response = await axios.post('http://localhost:8000/validate/Contents/validateWebUrl', { link:url,session_id:sessionId });
//       console.log(response)
//       if (response.data.valid) {
//         await onSubmit(url);
//         onClose();
//       } else {
//         setErrorMessage(response.data.message || 'URL validation failed');
//       }
//     } catch (error) {
//       if (error.response) {
//         // Server responded with error status
//         setErrorMessage(error.response.data?.reason || 'URL validation failed');
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
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Add Website URL</h3>
            
//             <div className="space-y-4">
//               <input
//                 type="url"
//                 value={url}
//                 onChange={(e) => {
//                   setUrl(e.target.value);
//                   setErrorMessage('');
//                 }}
//                 placeholder="https://example.com"
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
//                   disabled={isSubmitting || !url.trim()}
//                 >
//                   {isSubmitting ? 'Validating...' : 'Add URL'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default WeburlPopup;



import React, { useState, useEffect, useContext } from 'react';
import axiosWithAuth from '@/utils/axiosWithAuth';
import { AuthContext } from "../contexts/AuthContext";
import { toast } from 'sonner';

const WeburlPopup = ({ isOpen, onClose, onSubmit, sessionId }) => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const createNewSession = async (urlContent) => {
    try {
      const response = await axiosWithAuth().post("http://localhost:8000/session/createSession", {
        query: `[Website URL] ${urlContent}`,
      });
      
      return response.data.sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw new Error("Failed to create session for URL validation");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!url.trim()) {
      setErrorMessage('Please enter a website URL');
      return;
    }

    // Basic format validation for URL
    let formattedUrl = url.trim();
    try {
      // Try to construct a URL object to validate format
      new URL(formattedUrl);
    } catch (error) {
      // If not a valid URL, try adding https:// prefix
      try {
        formattedUrl = 'https://' + formattedUrl;
        new URL(formattedUrl); // Validate again
      } catch {
        setErrorMessage('Please enter a valid website URL');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let validationSessionId = sessionId;
      let newSessionCreated = false;

      // If no sessionId provided, create a new session first
      if (!validationSessionId) {
        try {
          validationSessionId = await createNewSession(formattedUrl);
          newSessionCreated = true;
          console.log("Created new session for validation:", validationSessionId);
        } catch (error) {
          setErrorMessage("Could not create session: " + error.message);
          return;
        }
      }

      // Now validate the URL with a session ID
      const response = await axiosWithAuth().post(
        '/validate/Contents/validateWebUrl',
        { link: formattedUrl, session_id: validationSessionId }
      );

      if (response.data.valid) {
        // If we created a new session, pass both URL and sessionId back
        if (newSessionCreated) {
          await onSubmit(formattedUrl, validationSessionId);
        } else {
          await onSubmit(formattedUrl);
        }
        onClose();
      } else {
        setErrorMessage(response.data.reason || 'URL validation failed');
        // If we created a new session but validation failed, we should clean it up
        if (newSessionCreated) {
          try {
            await axiosWithAuth().delete(`http://localhost:8000/session/deleteSession/${validationSessionId}`);
          } catch (cleanupError) {
            console.error("Failed to clean up temporary session:", cleanupError);
          }
        }
      }
    } catch (error) {
      console.error('URL validation error:', error);
      
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

  // Rest of component remains the same...
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="weburl-popup-title"
    >
      <div 
        className="bg-white rounded-lg w-96 shadow-2xl transform transition-all overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 id="weburl-popup-title" className="text-lg font-medium text-gray-900 mb-4">
              Add Website URL
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="url-input" className="sr-only">Website URL</label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="https://example.com"
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
                  disabled={isSubmitting || !url.trim()}
                >
                  {isSubmitting ? 'Validating...' : 'Add URL'}
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

export default WeburlPopup;