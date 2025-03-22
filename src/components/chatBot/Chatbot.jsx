import { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import api from '@/api';
import { parseSSEStream } from '@/utils';
import ChatMessages from '@/components/chatBot/ChatMessages';
import ChatInput from '@/components/chatBot/ChatInput';

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
      for await (const textChunk of parseSSEStream(stream)) {
        console.log("Received chunk:", textChunk); // Add logging here
        setMessages(draft => {
          draft[draft.length - 1].content += textChunk;
        });
      }
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
      });
    } catch (err) {
      console.log(err);
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
        draft[draft.length - 1].error = true;
      });
    }
  }

  return (
  <div className='flex flex-col min-h-full w-full mx-auto px-4 bg-chatbot-bg p-8 text-center'>
    <header className='sticky top-0 shrink-0 z-20 bg-chatbot-bg'>
      <div className='flex flex-col h-full w-full gap-1 pt-4 pb-2'>
        <h1 className='font-urbanist text-[2.0rem] font-semibold text-white'>Archelon AI</h1>
      </div>
    </header>
    <div className='relative grow flex flex-col gap-6 pt-6'>
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
        <div className='mt-3 font-urbanist text-primary-blue text-xl font-light space-y-2'>
          <p>👋 Welcome!</p>
          <p>Ask me anything about the coding related tasks.</p>
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