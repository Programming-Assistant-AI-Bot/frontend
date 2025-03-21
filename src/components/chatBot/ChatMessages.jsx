import Markdown from 'react-markdown';
import useAutoScroll from '@/hooks/useAutoScroll';
import Spinner from '@/components/chatBot/Spinner';
import errorIcon from '@/assets/images/error.svg';
import styles from '@/components/chatBot/ChatMessages.module.css';

function ChatMessages({ messages, isLoading }) {
  const scrollContentRef = useAutoScroll(isLoading);
  
  return (
    <div ref={scrollContentRef} className='grow space-y-4'>
      {messages.map(({ role, content, loading = false , error = null }, idx) => (
        <div key={idx} className={`flex items-start gap-4 py-4 px-3 rounded-xl text-white ${role === 'user' ? 'bg-message-purple/10 text-left' : ''}`}>
          <div>
            <div className={styles.markdownContainer}>
              {(loading && !content) ? <Spinner />
                : (role === 'assistant')
                  ? <Markdown>{content}</Markdown>
                  : <div className='whitespace-pre-line'>{content}</div>
              }
            </div>
            {error && (
              <div className={`flex items-center gap-1 text-sm text-error-red ${content && 'mt-2'}`}>
                <img className='h-5 w-5' src={errorIcon} alt='error' />
                <span>Error generating the response</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;