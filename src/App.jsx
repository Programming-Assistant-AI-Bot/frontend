import Chatbot from '@/components/chatBot/Chatbot';
import './App.css'
import SignUpBaseInfo from '@/components/signUp/SignUpBaseInfo';
import { Route,Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Chatbot/>}/>
        <Route path='/signup' element={<SignUpBaseInfo/>}/>
      </Routes>
    </>
  )
}

export default App
