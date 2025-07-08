import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';
import useAutoScroll from '@/hooks/useAutoScroll';
import Spinner from '@/components/chatBot/Spinner';
import errorIcon from '@/assets/images/error.svg';
import styles from '@/components/chatBot/ChatMessages.module.css';
import logo3 from './turtle.svg';

// Regex for complete code blocks
const codeBlockRegex = /```(?:([\w]+)\n)?([\s\S]*?)```/g;

// Detects if content ends with an unclosed code block
function isOpeningCodeBlock(content) {
  const segments = content.split("```");
  return segments.length > 1 && segments.length % 2 === 0;
}

// Parse message content to extract code blocks
function parseMessageContent(content) {
  if (!content) return { processedContent: '', codeBlocks: [] };
  
  const codeBlocks = [];
  
  // Replace complete code blocks with placeholders
  let processedContent = content.replace(codeBlockRegex, (match, language, code) => {
    language = language ? language.trim() : detectLanguage(code);
    const id = `__codeblock_${codeBlocks.length}__`;
    codeBlocks.push({ id, language, code, isComplete: true });
    return id;
  });
  
  // Handle streaming (incomplete) code blocks
  if (isOpeningCodeBlock(processedContent)) {
    const segments = processedContent.split("```");
    const textContent = segments.slice(0, -1).join("```");
    const potentialCode = segments[segments.length - 1];
    
    let language = '';
    let code = potentialCode;
    
    const firstLineBreak = potentialCode.indexOf('\n');
    if (firstLineBreak > 0) {
      const firstLine = potentialCode.substring(0, firstLineBreak).trim();
      if (firstLine && !firstLine.includes(' ')) {
        language = firstLine;
        code = potentialCode.substring(firstLineBreak + 1);
      }
    }
    
    if (!language) {
      language = detectLanguage(code, true);
    }
    
    const id = `__codeblock_${codeBlocks.length}__`;
    codeBlocks.push({ id, language, code, isComplete: false });
    processedContent = textContent + "```" + id;
  }
  
  return { processedContent, codeBlocks };
}

// Language detection based on code content
function detectLanguage(code, earlyDetection = false) {
  if (!code || code.trim() === '') return 'plaintext';
  
  const perlIndicators = [
    { pattern: /(?:^|\n)\s*use\s+(?:strict|warnings|v?[\d.]+);/m, weight: 5 },
    { pattern: /(?:^|\n)\s*package\s+[\w:]+;/m, weight: 5 },
    { pattern: /(?:^|\n)\s*sub\s+\w+\s*(?:\([^)]*\))?\s*{/m, weight: 4 },
    { pattern: /\$[#]|@{|\${|\$\$|%{|\&{|\@ARGV|\%ENV|\$\d+/m, weight: 4 },
    { pattern: /->(?:new|can|isa|push|shift|pop|splice|grep|map)/m, weight: 4 },
    { pattern: /(?:^|\n)\s*(?:my|our|local)\s+(?:\$|\@|\%)\w+/m, weight: 3 },
    { pattern: /=~/m, weight: 3 },
    { pattern: /(?:^|\n)\s*(?:if|unless|for|while|until)\s*\(/m, weight: 2 },
    { pattern: /qw\(\s*[\w\s]+\s*\)/m, weight: 3 },
    { pattern: /\$\w+\s*=|\@\w+\s*=|\%\w+\s*=/m, weight: 2 },
    { pattern: /\$\w+/m, weight: 1 },
    { pattern: /\@\w+/m, weight: 1 },
    { pattern: /\%\w+/m, weight: 1 },
    { pattern: /print\s+(?:\$\w+|\@\w+|".+?"|'.+?')/m, weight: 1 },
    { pattern: /->[a-zA-Z0-9_]+/m, weight: 1 }
  ];
  
  let perlScore = 0;
  for (const indicator of perlIndicators) {
    const matches = (code.match(indicator.pattern) || []).length;
    perlScore += matches * indicator.weight;
  }
  
  if (perlScore >= 5) return 'perl';
  
  if (
    /(?:^|\n)\s*def\s+\w+\s*\(/m.test(code) ||
    /(?:^|\n)\s*import\s+[\w.]+|from\s+[\w.]+\s+import/m.test(code) ||
    /(?:^|\n)\s*class\s+\w+(?:\s*\(\s*\w+\s*\))?:/m.test(code) ||
    /:\s*\n\s+/m.test(code) ||
    code.includes('print(')
  ) return 'python';
  
  if (
    /(?:^|\n)\s*(?:function|const|let|var|import|export)\s+/m.test(code) ||
    /=>\s*{|\(\)\s*=>/m.test(code) ||
    /\$\("\w+"\)|\$\('\w+'\)/m.test(code) ||
    /console\.log\(/m.test(code)
  ) return 'javascript';
  
  if (
    /(?:^|\n)\s*(?:public|private|protected)\s+(?:class|interface|enum)/m.test(code) ||
    /(?:^|\n)\s*(?:public|private|protected)\s+(?:static\s+)?\w+\s+\w+\s*\(/m.test(code) ||
    /System\.out\.print(?:ln)?\(/m.test(code)
  ) return 'java';
  
  if (
    /(?:<\?php)|(?:\?>)/m.test(code) ||
    (/\$\w+\s*=\s*(?!\/)/m.test(code) && !/sub\s+\w+/m.test(code))
  ) return 'php';
  
  return 'plaintext';
}

function ChatMessages({ messages, isLoading }) {
  const scrollContentRef = useAutoScroll(isLoading);
  
  return (
    <div ref={scrollContentRef} className='grow space-y-4'>
      {messages.map(({ role, content, loading = false, error = null }, idx) => {
        const { processedContent, codeBlocks } = parseMessageContent(content);
        
        return (
          <div className='flex' key={idx}>
            {role === 'assistant' && (
              <img
                src={logo3}
                alt='logo'
                className='h-12 w-12 object-contain self-start sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14'
              />
            )}
            <div
              className={`flex items-start gap-4 py-4 px-3 rounded-xl text-white ${
                role === 'user' ? 'bg-[#965ECD] text-left w-[50%] ml-[48%]' : 'w-[80%] bg-message-purple/10'
              }`}
            >
              <div className="w-full">
                <div className={styles.markdownContainer}>
                  {loading && !content ? (
                    <Spinner />
                  ) : (
                    <>
                      {codeBlocks.length > 0 ? (
                        processedContent.split(/(__codeblock_\d+__)/g).map((part, i) => {
                          if (part.match(/__codeblock_\d+__/)) {
                            const blockData = codeBlocks.find(block => block.id === part);
                            if (blockData) {
                              return (
                                <CodeBlock
                                  key={`code-${i}`}
                                  code={blockData.code}
                                  language={blockData.language}
                                  isComplete={blockData.isComplete}
                                />
                              );
                            }
                          }
                          return part ? <ReactMarkdown key={`text-${i}`}>{part}</ReactMarkdown> : null;
                        })
                      ) : (
                        <ReactMarkdown>{processedContent}</ReactMarkdown>
                      )}
                    </>
                  )}
                </div>
                {error && (
                  <div className={`flex items-center gap-1 text-sm text-error-red ${content && 'mt-2'}`}>
                    <img className='h-5 w-5' src={errorIcon} alt='error' />
                    <span>Error generating the response</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatMessages;








// import { useRef, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import CodeBlock from './CodeBlock';
// import useAutoScroll from '@/hooks/useAutoScroll';
// import Spinner from './Spinner';
// import errorIcon from '@/assets/images/error.svg';
// import styles from '@/components/chatBot/ChatMessages.module.css';
// import logo3 from './turtle.svg'

// // Improved regex that better handles language identifiers
// // Original regex for complete code blocks
// const codeBlockRegex = /(?:([\w]+)\n)?([\s\S]*?)/g;

// // Add this function to better detect opening code blocks
// function isOpeningCodeBlock(content) {
//   const segments = content.split("");
//   // Even number of segments means we're inside a code block
//   return segments.length > 1 && segments.length % 2 === 0;
// }

// // Then modify your parseMessageContent function:
// function parseMessageContent(content) {
//   if (!content) return { processedContent: '', codeBlocks: [] };
  
//   // Don't re-normalize content - it should already be normalized by processMarkdown
//   // Only focus on extracting code blocks
  
//   const codeBlocks = [];
  
//   // Find complete code blocks
//   let processedContent = content.replace(codeBlockRegex, (match, language, code) => {
//     language = language ? language.trim() : detectLanguage(code);
    
//     const id = `__codeblock_${codeBlocks.length}__`;
//     codeBlocks.push({ id, language, code, isComplete: true });
//     return id;
//   });
  
//   // Second pass: check for opening code block (streaming case)
//   if (isOpeningCodeBlock(processedContent)) {
//     const segments = processedContent.split("");
//     // Get everything before the last segment (text content)
//     const textContent = segments.slice(0, -1).join("");
//     // Get potential language identifier and code content
//     const potentialCode = segments[segments.length - 1];
    
//     // Extract language from first line if present
//     const firstLineBreak = potentialCode.indexOf('\n');
//     let language = '';
//     let code = potentialCode;
    
//     if (firstLineBreak > 0) {
//       const firstLine = potentialCode.substring(0, firstLineBreak).trim();
//       // If first line looks like a language identifier (no spaces)
//       if (firstLine && !firstLine.includes(' ')) {
//         language = firstLine;
//         code = potentialCode.substring(firstLineBreak + 1);
//       }
//     }
    
//     // Use more aggressive language detection for streaming
//     if (!language) {
//       language = detectLanguage(code, true); // true = early detection mode
//     }
    
//     // Replace original content with processed text + placeholder
//     const id = `__codeblock_${codeBlocks.length}__`;
//     codeBlocks.push({ id, language, code, isComplete: false });
//     processedContent = textContent + "" + id;
//   }
  
//   return { processedContent, codeBlocks };
// }

// // Language detection based on code content
// function detectLanguage(code) {
//   // Early return for empty code
//   if (!code || code.trim() === '') {
//     return 'plaintext';
//   }
  
//   // PERL DETECTION (PRIMARY FOCUS)
//   // Comprehensive pattern matching for Perl-specific syntax
//   const perlIndicators = [
//     // Strong Perl indicators (weighted heavily)
//     { pattern: /(?:^|\n)\s*use\s+(?:strict|warnings|v?[\d.]+);/m, weight: 5 },       // use strict/warnings
//     { pattern: /(?:^|\n)\s*package\s+[\w:]+;/m, weight: 5 },                         // package declarations
//     { pattern: /(?:^|\n)\s*sub\s+\w+\s*(?:\([^)]\))?\s{/m, weight: 4 },            // subroutine definitions
//     { pattern: /\$[#]|@{|\${|\$\$|%{|\&{|\@ARGV|\%ENV|\$\d+/m, weight: 4 },          // special variables
//     { pattern: /->(?:new|can|isa|push|shift|pop|splice|grep|map)/m, weight: 4 },     // common OO method calls
    
//     // Medium Perl indicators
//     { pattern: /(?:^|\n)\s*(?:my|our|local)\s+(?:\$|\@|\%)\w+/m, weight: 3 },        // variable declarations
//     { pattern: /=~/m, weight: 3 },                                                   // regex matching operator
//     { pattern: /(?:^|\n)\s*(?:if|unless|for|while|until)\s*\(/m, weight: 2 },        // control structures
//     { pattern: /qw\(\s*[\w\s]+\s*\)/m, weight: 3 },                                  // qw() quotes
//     { pattern: /\$\w+\s*=|\@\w+\s*=|\%\w+\s*=/m, weight: 2 },                        // variable assignments

//     // Weak Perl indicators (common but not unique)
//     { pattern: /\$\w+/m, weight: 1 },                                                // scalar variables
//     { pattern: /\@\w+/m, weight: 1 },                                                // array variables
//     { pattern: /\%\w+/m, weight: 1 },                                                // hash variables
//     { pattern: /print\s+(?:\$\w+|\@\w+|".+?"|'.+?')/m, weight: 1 },                  // print statements
//     { pattern: /->[a-zA-Z0-9_]+/m, weight: 1 }                                       // -> dereference operator
//   ];
  
//   // Calculate Perl score
//   let perlScore = 0;
//   for (const indicator of perlIndicators) {
//     const matches = (code.match(indicator.pattern) || []).length;
//     perlScore += matches * indicator.weight;
//   }
  
//   // Return Perl if score exceeds threshold
//   if (perlScore >= 5) {
//     return 'perl';
//   }
  
//   // OTHER LANGUAGES (FALLBACKS)
  
//   // Python detection
//   if (
//     /(?:^|\n)\s*def\s+\w+\s*\(/m.test(code) ||                             // function definition
//     /(?:^|\n)\s*import\s+[\w.]+|from\s+[\w.]+\s+import/m.test(code) ||     // imports
//     /(?:^|\n)\s*class\s+\w+(?:\s*\(\s*\w+\s*\))?:/m.test(code) ||          // class definition
//     /:\s*\n\s+/m.test(code) ||                                             // indented blocks
//     code.includes('print(')                                                // print function
//   ) {
//     return 'python';
//   }
  
//   // JavaScript detection
//   if (
//     /(?:^|\n)\s*(?:function|const|let|var|import|export)\s+/m.test(code) || // JS keywords
//     /=>\s*{|\(\)\s*=>/m.test(code) ||                                       // arrow functions
//     /\$\("\w+"\)|\$\('\w+'\)/m.test(code) ||                                // jQuery
//     /console\.log\(/m.test(code)                                            // console.log
//   ) {
//     return 'javascript';
//   }
  
//   // Java detection
//   if (
//     /(?:^|\n)\s*(?:public|private|protected)\s+(?:class|interface|enum)/m.test(code) || // class definition
//     /(?:^|\n)\s*(?:public|private|protected)\s+(?:static\s+)?\w+\s+\w+\s*\(/m.test(code) || // method definition 
//     /System\.out\.print(?:ln)?\(/m.test(code)                                          // System.out
//   ) {
//     return 'java';
//   }
  
  
//   // PHP detection
//   if (
//     /(?:<\?php)|(?:\?>)/m.test(code) ||                                  // PHP tags
//     /\$\w+\s*=\s*(?!\/)/m.test(code) &&                                  // variable assignment (not regex)
//     !/sub\s+\w+/m.test(code)                                             // but not Perl sub
//   ) {
//     return 'php';
//   }
  
//   // If no language is clearly identified
//   return 'plaintext';
// }

// function ChatMessages({ messages, isLoading }) {
//   const scrollContentRef = useAutoScroll(isLoading);
  
//   return (
//     <div ref={scrollContentRef} className='grow space-y-4'>
//       {messages.map(({ role, content, loading = false, error = null }, idx) => {
//         const { processedContent, codeBlocks } = parseMessageContent(content);
        
//         return (
//           <div className='flex'>
//               {(role==='assistant') && 
//                 <img src={logo3} alt='logo' className='h-12 w-12 object-contain self-start sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14  '/>
//               }
//           <div key={idx} className={`flex items-start gap-4 py-4 px-3 rounded-xl text-white ${role === 'user' ? 'bg-[#965ECD] text-left w-[50%] ml-[48%]' : 'w-[80%] bg-message-purple/10'}`}>
//             <div className="w-full">

//               <div className={styles.markdownContainer}>
//                 {(loading && !content) ? <Spinner /> : (
//                   <>
//                     {codeBlocks.length > 0 ? (
//                       // Split by code block placeholders and render each part
//                       processedContent.split(/(\\_codeblock\\d+\\)/g).map((part, i) => {
//                         if (part.match(/\\_codeblock\\d+\\/)) {
//                           // This is a code block placeholder
//                           const blockData = codeBlocks.find(block => block.id === part);
//                           if (blockData) {
//                             return <CodeBlock 
//                               key={`code-${i}`} 
//                               code={blockData.code} 
//                               language={blockData.language}
//                               isComplete={blockData.isComplete} 
//                             />;
//                           }
//                         }
//                         // Regular text part
//                         return part ? <ReactMarkdown key={`text-${i}`}>{part}</ReactMarkdown> : null;
//                       })
//                     ) : (
//                       // No code blocks, just render the content
//                       <ReactMarkdown>{processedContent}</ReactMarkdown>
//                     )}
                
//                   </>
//                 )}
//               </div>
//               {error && (
//                 <div className={`flex items-center gap-1 text-sm text-error-red ${content && 'mt-2'}`}>
//                   <img className='h-5 w-5' src={errorIcon} alt='error' />
//                   <span>Error generating the response</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default ChatMessages;


// import TurtleIcon from "./turtle.svg";
// import { Progress } from "@/components/ui/progress";
// import { CheckCircle2, AlertCircle, Upload, User } from "lucide-react";
// import DOMPurify from "dompurify";

// const ChatMessage = ({ message }) => {
//   const isUser = message.sender === "user";

//   const renderAttachment = () => {
//     if (!message.attachment) return null;

//     const { type, name, status, link, url } = message.attachment;

//     return (
//       <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded-lg max-w-md">
//         {type === "pdf" ? (
//           <>
//             <Upload className="h-4 w-4 text-purple-300" />
//             <div className="flex-1">
//               <div className="text-sm font-medium text-white">{name}</div>
//               {status === "uploading" && (
//                 <div className="flex items-center gap-2">
//                   <Progress value={0} className="w-24 h-2 bg-gray-700" />
//                   <span className="text-xs text-gray-300">Uploading...</span>
//                 </div>
//               )}
//               {status === "success" && (
//                 <a
//                   href={link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
//                 >
//                   <CheckCircle2 className="h-4 w-4" />
//                   View Document
//                 </a>
//               )}
//               {status === "error" && (
//                 <div className="text-sm text-red-400 flex items-center gap-1">
//                   <AlertCircle className="h-4 w-4" />
//                   Upload failed
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-blue-400 hover:text-blue-300 transition"
//           >
//             {type === "repository" ? "View Repository" : "Visit Website"}
//           </a>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
//       <div className={`max-w-3xl w-full flex ${isUser ? "flex-row-reverse" : ""}`}>
//         <div className="flex-shrink-0 mx-2">
//           {isUser ? (
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
//               <User className="h-5 w-5 text-white" />
//             </div>
//           ) : (
//             <img
//               src={TurtleIcon}
//               alt="Archelon AI"
//               className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full p-1.5"
//             />
//           )}
//         </div>
//         <div className={`rounded-2xl px-4 py-3 ${isUser ? "bg-[#4e0363] rounded-tr-none" : "bg-[#741e8a] rounded-tl-none"}`}>
//           <div className={`text-white ${isUser ? "text-right" : ""}`}>
//             {isUser ? (
//               message.text.split("\n").map((paragraph, i) => <p key={i} className="mb-2 last:mb-0">{paragraph}</p>)
//             ) : (
//               <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.text) }} />
//             )}
//           </div>
//           {renderAttachment()}
//           {message.loading && <div className="text-gray-300 text-sm mt-2">Loading...</div>}
//           {message.error && <div className="text-red-400 text-sm mt-2">Error generating response</div>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;


