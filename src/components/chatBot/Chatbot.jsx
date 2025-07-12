import { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import api from '@/api';
import { parseSSEStream,processMarkdown,trackCodeBlockState } from '@/utils';
import ChatMessages from '@/components/chatBot/ChatMessages';
import ChatInput from '@/components/chatBot/ChatInput';
import logo2 from '@/assets/images/logo.png'

function Chatbot() {
  const [sessionInput, setSessionInput] = useState('');
  const [activeSession, setActiveSession] = useState(''); 
  const [messages, setMessages] = useImmer([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const isLoading = messages.length && messages[messages.length - 1].loading;

  async function loadChatSession(sessionIdToLoad) {
    if (!sessionIdToLoad.trim()) return;

    setIsLoadingHistory(true);
    try {
      // load history
      const history = await api.getChatHistory(sessionIdToLoad);
      
      // Handle the array response directly (backend returns an array, not an object with messages property)
      if (Array.isArray(history) && history.length > 0) {
        setMessages(history);
        console.log(history)
      } else if (history && history.messages && history.messages.length > 0) {
        // Keep the original object.messages handling as fallback
       
        setMessages(history.messages);
      }
      
      setActiveSession(sessionIdToLoad);
    } catch (err) {
      console.error("Failed to load chat session:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function submitNewMessage() {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading || isLoadingHistory) return;
  
    setMessages(draft => [...draft,
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: '', loading: true }
    ]);
    setNewMessage('');
  
    try {
      const stream = await api.sendChatMessage(activeSession, trimmedMessage);
      let rawAccumulatedResponse = '';
      let codeBlockState = { inBlock: false, lang: '' };
      
      for await (const chunk of parseSSEStream(stream)) {
        // Process chunk and track code block state
        rawAccumulatedResponse += chunk;
        codeBlockState = trackCodeBlockState(chunk, codeBlockState);
        
        // Process the accumulated response
        const processedResponse = processMarkdown(rawAccumulatedResponse);
        
        // Update UI with processed content
        setMessages(draft => {
          draft[draft.length - 1].content = processedResponse;
        });
      }
      
      
      // Final processing after stream completes
      setMessages(draft => {
        // Ensure final message has proper formatting
        draft[draft.length - 1].content = processMarkdown(rawAccumulatedResponse);
        draft[draft.length - 1].loading = false;
        console.log(draft[draft.length-1].content);
      });
      
    } catch (err) {
      console.error("Error during chat:", err);
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
        draft[draft.length - 1].error = true;
      });
    }
  }

  return (
  <div className='flex flex-col min-h-full w-full bg-chatbot-bg p-4 '>
    <header className='fixed top-0 right-0 left-0 z-20 bg-chatbot-bg w-full h-[15vh]'>
        <img src={logo2} alt="logo" className='w-1/3 ml-[60%] h-full object-contain'/>
    </header>
    <div className='relative grow flex flex-col gap-6 pt-[15vh]'>
      {/* Session ID input field */}
      {!activeSession && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter session ID"
              value={sessionInput}
              onChange={(e) => setSessionInput(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-blue outline-none"
              disabled={isLoadingHistory}
            />
            <button
              onClick={() => loadChatSession(sessionInput)}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-blue/80 disabled:opacity-50"
              disabled={isLoadingHistory || !sessionInput.trim()}
            >
              {isLoadingHistory ? "Loading..." : "Load Session"}
            </button>
          </div>
        </div>
      )}

      {activeSession && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">Session ID: {activeSession}</p>
          <button 
            onClick={() => {
              setActiveSession('');
              setMessages([]);
            }}
            className="text-sm text-primary-blue hover:text-primary-blue/80"
          >
            Change Session
          </button>
        </div>
      )}

      {messages.length === 0 && !isLoadingHistory && (
        <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2 text-center'>
          <p>👋 Welcome!</p>
          <p>Ask me anything about the perl coding related tasks.</p>
        </div>
      )}

      {isLoadingHistory && (
        <div className="flex justify-center items-center py-8">
          <p className="text-primary-blue">Loading chat history...</p>
        </div>
      )}

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading || isLoadingHistory}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  </div>
  );
}

export default Chatbot;