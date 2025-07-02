
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeburlPopup = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
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
    
    try {
    
      new URL(url);
    } catch (error) {
      setErrorMessage('Please enter a valid website URL (e.g., https://example.com)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:8000/session/validateWebUrl', { link:url });
      console.log(response)
      if (response.data.valid) {
        await onSubmit(url);
        onClose();
      } else {
        setErrorMessage(response.data.message || 'URL validation failed');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        setErrorMessage(error.response.data?.reason || 'URL validation failed');
      } else if (error.request) {
        setErrorMessage('Server not responding. Please try again later.');
      } else {
        setErrorMessage('An unexpected error occurred.');
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
    >
      <div 
        className="bg-white rounded-lg w-96 shadow-2xl transform transition-all overflow-hidden"
        style={{ animation: 'slideUp 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Website URL</h3>
            
            <div className="space-y-4">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="https://example.com"
                className={`w-full px-4 py-2 border ${
                  errorMessage ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoFocus
                required
              />
              
              {errorMessage && (
                <p className="text-sm text-red-500">
                  {errorMessage}
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
                  disabled={isSubmitting || !url.trim()}
                >
                  {isSubmitting ? 'Validating...' : 'Add URL'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeburlPopup;