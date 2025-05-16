import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'react-syntax-highlighter/dist/esm/languages/prism/perl';

function CodeBlock({ code, language, isComplete = true }) {
    const [copied, setCopied] = useState(false);
    
    // Format code with line breaks
    const formattedCode = code
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    
    const copyToClipboard = () => {
      navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    return (
      <div className={`
        relative group rounded-md overflow-hidden my-4 bg-[#1e1e1e]
        ${!isComplete ? 'border-l-2 border-yellow-500' : ''}
      `}>
        <div className="flex justify-between items-center px-4 py-2 bg-[#252525] text-gray-300 text-sm">
          <span>
            {language || 'code'}
            {!isComplete && (
              <span className="ml-2 text-yellow-500 inline-flex items-center">
                <span className="animate-pulse mr-1">●</span> 
                typing...
              </span>
            )}
          </span>
          <button 
            onClick={copyToClipboard}
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          >
           {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0, 
            padding: '1rem', 
            whiteSpace: 'pre',  // Change from 'pre-wrap' to 'pre'
            transition: 'all 0.3s ease',
            lineHeight: 1.5,
          }}
          wrapLines={true}
          showLineNumbers={false}
        >
          {formattedCode}
        </SyntaxHighlighter>
      </div>
    );
}

export default CodeBlock;