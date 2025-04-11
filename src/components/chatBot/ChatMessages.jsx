import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/chatBot/CodeBlock';
import useAutoScroll from '@/hooks/useAutoScroll';
import Spinner from '@/components/chatBot/Spinner';
import errorIcon from '@/assets/images/error.svg';
import styles from '@/components/chatBot/ChatMessages.module.css';

// Improved regex that better handles language identifiers
// Original regex for complete code blocks
const codeBlockRegex = /```(?:([\w]+)\n)?([\s\S]*?)```/g;

// Add this function to better detect opening code blocks
function isOpeningCodeBlock(content) {
  const segments = content.split("```");
  // Even number of segments means we're inside a code block
  return segments.length > 1 && segments.length % 2 === 0;
}

// Then modify your parseMessageContent function:
function parseMessageContent(content) {
  if (!content) return { processedContent: '', codeBlocks: [] };
  
  // Don't re-normalize content - it should already be normalized by processMarkdown
  // Only focus on extracting code blocks
  
  const codeBlocks = [];
  
  // Find complete code blocks
  let processedContent = content.replace(codeBlockRegex, (match, language, code) => {
    language = language ? language.trim() : detectLanguage(code);
    
    const id = `__codeblock_${codeBlocks.length}__`;
    codeBlocks.push({ id, language, code, isComplete: true });
    return id;
  });
  
  // Second pass: check for opening code block (streaming case)
  if (isOpeningCodeBlock(processedContent)) {
    const segments = processedContent.split("```");
    // Get everything before the last segment (text content)
    const textContent = segments.slice(0, -2).join("```");
    // Get potential language identifier and code content
    const potentialCode = segments[segments.length - 1];
    
    // Extract language from first line if present
    const firstLineBreak = potentialCode.indexOf('\n');
    let language = '';
    let code = potentialCode;
    
    if (firstLineBreak > 0) {
      const firstLine = potentialCode.substring(0, firstLineBreak).trim();
      // If first line looks like a language identifier (no spaces)
      if (firstLine && !firstLine.includes(' ')) {
        language = firstLine;
        code = potentialCode.substring(firstLineBreak + 1);
      }
    }
    
    // Use more aggressive language detection for streaming
    if (!language) {
      language = detectLanguage(code, true); // true = early detection mode
    }
    
    // Replace original content with processed text + placeholder
    const id = `__codeblock_${codeBlocks.length}__`;
    codeBlocks.push({ id, language, code, isComplete: false });
    processedContent = textContent + "```" + id;
  }
  
  return { processedContent, codeBlocks };
}

// Language detection based on code content
function detectLanguage(code) {
  // Early return for empty code
  if (!code || code.trim() === '') {
    return 'plaintext';
  }
  
  // PERL DETECTION (PRIMARY FOCUS)
  // Comprehensive pattern matching for Perl-specific syntax
  const perlIndicators = [
    // Strong Perl indicators (weighted heavily)
    { pattern: /(?:^|\n)\s*use\s+(?:strict|warnings|v?[\d.]+);/m, weight: 5 },       // use strict/warnings
    { pattern: /(?:^|\n)\s*package\s+[\w:]+;/m, weight: 5 },                         // package declarations
    { pattern: /(?:^|\n)\s*sub\s+\w+\s*(?:\([^)]*\))?\s*{/m, weight: 4 },            // subroutine definitions
    { pattern: /\$[#]|@{|\${|\$\$|%{|\&{|\@ARGV|\%ENV|\$\d+/m, weight: 4 },          // special variables
    { pattern: /->(?:new|can|isa|push|shift|pop|splice|grep|map)/m, weight: 4 },     // common OO method calls
    
    // Medium Perl indicators
    { pattern: /(?:^|\n)\s*(?:my|our|local)\s+(?:\$|\@|\%)\w+/m, weight: 3 },        // variable declarations
    { pattern: /=~/m, weight: 3 },                                                   // regex matching operator
    { pattern: /(?:^|\n)\s*(?:if|unless|for|while|until)\s*\(/m, weight: 2 },        // control structures
    { pattern: /qw\(\s*[\w\s]+\s*\)/m, weight: 3 },                                  // qw() quotes
    { pattern: /\$\w+\s*=|\@\w+\s*=|\%\w+\s*=/m, weight: 2 },                        // variable assignments

    // Weak Perl indicators (common but not unique)
    { pattern: /\$\w+/m, weight: 1 },                                                // scalar variables
    { pattern: /\@\w+/m, weight: 1 },                                                // array variables
    { pattern: /\%\w+/m, weight: 1 },                                                // hash variables
    { pattern: /print\s+(?:\$\w+|\@\w+|".+?"|'.+?')/m, weight: 1 },                  // print statements
    { pattern: /->[a-zA-Z0-9_]+/m, weight: 1 }                                       // -> dereference operator
  ];
  
  // Calculate Perl score
  let perlScore = 0;
  for (const indicator of perlIndicators) {
    const matches = (code.match(indicator.pattern) || []).length;
    perlScore += matches * indicator.weight;
  }
  
  // Return Perl if score exceeds threshold
  if (perlScore >= 5) {
    return 'perl';
  }
  
  // OTHER LANGUAGES (FALLBACKS)
  
  // Python detection
  if (
    /(?:^|\n)\s*def\s+\w+\s*\(/m.test(code) ||                             // function definition
    /(?:^|\n)\s*import\s+[\w.]+|from\s+[\w.]+\s+import/m.test(code) ||     // imports
    /(?:^|\n)\s*class\s+\w+(?:\s*\(\s*\w+\s*\))?:/m.test(code) ||          // class definition
    /:\s*\n\s+/m.test(code) ||                                             // indented blocks
    code.includes('print(')                                                // print function
  ) {
    return 'python';
  }
  
  // JavaScript detection
  if (
    /(?:^|\n)\s*(?:function|const|let|var|import|export)\s+/m.test(code) || // JS keywords
    /=>\s*{|\(\)\s*=>/m.test(code) ||                                       // arrow functions
    /\$\("\w+"\)|\$\('\w+'\)/m.test(code) ||                                // jQuery
    /console\.log\(/m.test(code)                                            // console.log
  ) {
    return 'javascript';
  }
  
  // Java detection
  if (
    /(?:^|\n)\s*(?:public|private|protected)\s+(?:class|interface|enum)/m.test(code) || // class definition
    /(?:^|\n)\s*(?:public|private|protected)\s+(?:static\s+)?\w+\s+\w+\s*\(/m.test(code) || // method definition 
    /System\.out\.print(?:ln)?\(/m.test(code)                                          // System.out
  ) {
    return 'java';
  }
  
  
  // PHP detection
  if (
    /(?:<\?php)|(?:\?>)/m.test(code) ||                                  // PHP tags
    /\$\w+\s*=\s*(?!\/)/m.test(code) &&                                  // variable assignment (not regex)
    !/sub\s+\w+/m.test(code)                                             // but not Perl sub
  ) {
    return 'php';
  }
  
  // If no language is clearly identified
  return 'plaintext';
}

function ChatMessages({ messages, isLoading }) {
  const scrollContentRef = useAutoScroll(isLoading);
  
  return (
    <div ref={scrollContentRef} className='grow space-y-4'>
      {messages.map(({ role, content, loading = false, error = null }, idx) => {
        const { processedContent, codeBlocks } = parseMessageContent(content);
        
        return (
          <div key={idx} className={`flex items-start gap-4 py-4 px-3 rounded-xl text-white ${role === 'user' ? 'bg-message-purple/10 text-left' : ''}`}>
            <div className="w-full">
              <div className={styles.markdownContainer}>
                {(loading && !content) ? <Spinner /> : (
                  <>
                    {codeBlocks.length > 0 ? (
                      // Split by code block placeholders and render each part
                      processedContent.split(/(\_\_codeblock\_\d+\_\_)/g).map((part, i) => {
                        if (part.match(/\_\_codeblock\_\d+\_\_/)) {
                          // This is a code block placeholder
                          const blockData = codeBlocks.find(block => block.id === part);
                          if (blockData) {
                            return <CodeBlock 
                              key={`code-${i}`} 
                              code={blockData.code} 
                              language={blockData.language}
                              isComplete={blockData.isComplete} 
                            />;
                          }
                        }
                        // Regular text part
                        return part ? <ReactMarkdown key={`text-${i}`}>{part}</ReactMarkdown> : null;
                      })
                    ) : (
                      // No code blocks, just render the content
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
        );
      })}
    </div>
  );
}

export default ChatMessages;