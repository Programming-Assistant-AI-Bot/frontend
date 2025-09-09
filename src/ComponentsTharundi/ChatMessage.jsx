import { useRef } from 'react';
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
function parseMessageContent(content, isStreaming = false) {
  if (!content) return { processedContent: '', codeBlocks: [] };
  
  const codeBlocks = [];
  
  // Handle complete code blocks first
  let processedContent = content.replace(codeBlockRegex, (match, language, code) => {
    language = language ? language.trim() : detectLanguage(code);
    const id = `__codeblock_${codeBlocks.length}__`;
    codeBlocks.push({ id, language, code, isComplete: true });
    return id;
  });
  
  // Handle incomplete code blocks (both streaming and non-streaming)
  if (isOpeningCodeBlock(processedContent)) {
    const segments = processedContent.split("```");
    const textContent = segments.slice(0, -1).join("```");
    const potentialCode = segments[segments.length - 1];
    
    let language = '';
    let code = potentialCode;
    
    // Check if first line is a language specifier
    const firstLineBreak = potentialCode.indexOf('\n');
    if (firstLineBreak > 0) {
      const firstLine = potentialCode.substring(0, firstLineBreak).trim();
      if (firstLine && !firstLine.includes(' ') && firstLine.length < 20) {
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
    <div ref={scrollContentRef} className="grow space-y-4">
      {messages.map(({ id, role, content, loading = false, error = null, isStreaming = false }, idx) => {
        const { processedContent, codeBlocks } = parseMessageContent(content, isStreaming);
        
        return (
          <div
            className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
            key={id || idx}
          >
            {role === 'assistant' && (
              <img
                src={logo3}
                alt="logo"
                className="h-8 w-8 object-contain self-start mr-2"
              />
            )}
            <div
              className={`flex items-start gap-4 py-4 px-3 rounded-xl text-white ${
                role === 'user'
                  ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-left w-fit max-w-[50%] shadow-lg h-fit justify-center'
                  : 'w-fit max-w-[80%] bg-slate-800/50 backdrop-blur-sm border border-slate-700/30'
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
                                  isStreaming={isStreaming}
                                />
                              );
                            }
                          }
                          return part ? (
                            <div key={`text-${i}`} className="prose prose-invert max-w-none">
                              <ReactMarkdown>{part}</ReactMarkdown>
                            </div>
                          ) : null;
                        })
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{processedContent}</ReactMarkdown>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {error && (
                  <div className={`flex items-center gap-1 text-sm text-red-400 ${content && 'mt-2'}`}>
                    <img className="h-5 w-5" src={errorIcon} alt="error" />
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










// import { useRef } from 'react';
// import ReactMarkdown from 'react-markdown';
// import CodeBlock from './CodeBlock';
// import useAutoScroll from '@/hooks/useAutoScroll';
// import Spinner from '@/components/chatBot/Spinner';
// import errorIcon from '@/assets/images/error.svg';
// import styles from '@/components/chatBot/ChatMessages.module.css';
// import logo3 from './turtle.svg';

// // Regex for complete code blocks
// const codeBlockRegex = /```(?:([\w]+)\n)?([\s\S]*?)```/g;

// // Detects if content ends with an unclosed code block
// function isOpeningCodeBlock(content) {
//   const segments = content.split("```");
//   return segments.length > 1 && segments.length % 2 === 0;
// }

// // Parse message content to extract code blocks
// function parseMessageContent(content) {
//   if (!content) return { processedContent: '', codeBlocks: [] };
  
//   const codeBlocks = [];
  
//   // Replace complete code blocks with placeholders
//   let processedContent = content.replace(codeBlockRegex, (match, language, code) => {
//     language = language ? language.trim() : detectLanguage(code);
//     const id = `__codeblock_${codeBlocks.length}__`;
//     codeBlocks.push({ id, language, code, isComplete: true });
//     return id;
//   });
  
//   // Handle streaming (incomplete) code blocks
//   if (isOpeningCodeBlock(processedContent)) {
//     const segments = processedContent.split("```");
//     const textContent = segments.slice(0, -1).join("```");
//     const potentialCode = segments[segments.length - 1];
    
//     let language = '';
//     let code = potentialCode;
    
//     const firstLineBreak = potentialCode.indexOf('\n');
//     if (firstLineBreak > 0) {
//       const firstLine = potentialCode.substring(0, firstLineBreak).trim();
//       if (firstLine && !firstLine.includes(' ')) {
//         language = firstLine;
//         code = potentialCode.substring(firstLineBreak + 1);
//       }
//     }
    
//     if (!language) {
//       language = detectLanguage(code, true);
//     }
    
//     const id = `__codeblock_${codeBlocks.length}__`;
//     codeBlocks.push({ id, language, code, isComplete: false });
//     processedContent = textContent + "```" + id;
//   }
  
//   return { processedContent, codeBlocks };
// }

// // Language detection based on code content
// function detectLanguage(code, earlyDetection = false) {
//   if (!code || code.trim() === '') return 'plaintext';
  
//   const perlIndicators = [
//     { pattern: /(?:^|\n)\s*use\s+(?:strict|warnings|v?[\d.]+);/m, weight: 5 },
//     { pattern: /(?:^|\n)\s*package\s+[\w:]+;/m, weight: 5 },
//     { pattern: /(?:^|\n)\s*sub\s+\w+\s*(?:\([^)]*\))?\s*{/m, weight: 4 },
//     { pattern: /\$[#]|@{|\${|\$\$|%{|\&{|\@ARGV|\%ENV|\$\d+/m, weight: 4 },
//     { pattern: /->(?:new|can|isa|push|shift|pop|splice|grep|map)/m, weight: 4 },
//     { pattern: /(?:^|\n)\s*(?:my|our|local)\s+(?:\$|\@|\%)\w+/m, weight: 3 },
//     { pattern: /=~/m, weight: 3 },
//     { pattern: /(?:^|\n)\s*(?:if|unless|for|while|until)\s*\(/m, weight: 2 },
//     { pattern: /qw\(\s*[\w\s]+\s*\)/m, weight: 3 },
//     { pattern: /\$\w+\s*=|\@\w+\s*=|\%\w+\s*=/m, weight: 2 },
//     { pattern: /\$\w+/m, weight: 1 },
//     { pattern: /\@\w+/m, weight: 1 },
//     { pattern: /\%\w+/m, weight: 1 },
//     { pattern: /print\s+(?:\$\w+|\@\w+|".+?"|'.+?')/m, weight: 1 },
//     { pattern: /->[a-zA-Z0-9_]+/m, weight: 1 }
//   ];
  
//   let perlScore = 0;
//   for (const indicator of perlIndicators) {
//     const matches = (code.match(indicator.pattern) || []).length;
//     perlScore += matches * indicator.weight;
//   }
  
//   if (perlScore >= 5) return 'perl';
  
//   if (
//     /(?:^|\n)\s*def\s+\w+\s*\(/m.test(code) ||
//     /(?:^|\n)\s*import\s+[\w.]+|from\s+[\w.]+\s+import/m.test(code) ||
//     /(?:^|\n)\s*class\s+\w+(?:\s*\(\s*\w+\s*\))?:/m.test(code) ||
//     /:\s*\n\s+/m.test(code) ||
//     code.includes('print(')
//   ) return 'python';
  
//   if (
//     /(?:^|\n)\s*(?:function|const|let|var|import|export)\s+/m.test(code) ||
//     /=>\s*{|\(\)\s*=>/m.test(code) ||
//     /\$\("\w+"\)|\$\('\w+'\)/m.test(code) ||
//     /console\.log\(/m.test(code)
//   ) return 'javascript';
  
//   if (
//     /(?:^|\n)\s*(?:public|private|protected)\s+(?:class|interface|enum)/m.test(code) ||
//     /(?:^|\n)\s*(?:public|private|protected)\s+(?:static\s+)?\w+\s+\w+\s*\(/m.test(code) ||
//     /System\.out\.print(?:ln)?\(/m.test(code)
//   ) return 'java';
  
//   if (
//     /(?:<\?php)|(?:\?>)/m.test(code) ||
//     (/\$\w+\s*=\s*(?!\/)/m.test(code) && !/sub\s+\w+/m.test(code))
//   ) return 'php';
  
//   return 'plaintext';
// }

// function ChatMessages({ messages, isLoading }) {
//   const scrollContentRef = useAutoScroll(isLoading);
  
//   return (
//     <div ref={scrollContentRef} className="grow space-y-4">
//       {messages.map(({ role, content, loading = false, error = null }, idx) => {
//         const { processedContent, codeBlocks } = parseMessageContent(content);
        
//         return (
//           <div
//             className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}
//             key={idx}
//           >
//             {role === 'assistant' && (
//               <img
//                 src={logo3}
//                 alt="logo"
//                 className="h-8 w-8 object-contain self-start  mr-2"
//               />
//             )}
//             <div
//               className={`flex items-start gap-4 py-4 px-3 rounded-xl text-white ${
//                 role === 'user'
//                   ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-left w-fit max-w-[50%] shadow-lg h-fit justify-center'
//                   : 'w-fit max-w-[80%] bg-slate-800/50 backdrop-blur-sm border border-slate-700/30'
//               }`}
//             >
//               <div className="w-full">
//                 <div className={styles.markdownContainer}>
//                   {loading && !content ? (
//                     <Spinner />
//                   ) : (
//                     <>
//                       {codeBlocks.length > 0 ? (
//                         processedContent.split(/(__codeblock_\d+__)/g).map((part, i) => {
//                           if (part.match(/__codeblock_\d+__/)) {
//                             const blockData = codeBlocks.find(block => block.id === part);
//                             if (blockData) {
//                               return (
//                                 <CodeBlock
//                                   key={`code-${i}`}
//                                   code={blockData.code}
//                                   language={blockData.language}
//                                   isComplete={blockData.isComplete}
//                                 />
//                               );
//                             }
//                           }
//                           return part ? (
//                             <div key={`text-${i}`} className="prose prose-invert max-w-none">
//                               <ReactMarkdown>{part}</ReactMarkdown>
//                             </div>
//                           ) : null;
//                         })
//                       ) : (
//                         <div className="prose prose-invert max-w-none">
//                           <ReactMarkdown>{processedContent}</ReactMarkdown>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//                 {error && (
//                   <div className={`flex items-center gap-1 text-sm text-red-400 ${content && 'mt-2'}`}>
//                     <img className="h-5 w-5" src={errorIcon} alt="error" />
//                     <span>Error generating the response</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default ChatMessages;
