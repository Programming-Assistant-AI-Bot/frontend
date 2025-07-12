import styles from '@/components/chatBot/ChatMessages.module.css'
function Spinner() {
    return (
      <div className='relative h-12 w-12'>
        <span className={styles.spinnerChild + ' animate-spinner'} />
        <span className={styles.spinnerChild + ' animate-spinner-delayed'} />
      </div>
    );
  }
  
  export default Spinner;