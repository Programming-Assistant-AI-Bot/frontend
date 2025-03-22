import Chatbot from '@/components/chatBot/Chatbot';
import './App.css'
import SignUpBaseInfo from '@/components/signUp/SignUpBaseInfo';
import { Route,Routes } from 'react-router-dom';
import SignUpAdditionalInfo from './components/signup/SignUpAdditionalInfo';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Chatbot/>}/>
        <Route path='/signup' element={<SignUpBaseInfo/>}/>
        <Route path='/signup2' element={<SignUpAdditionalInfo/>}/>
      </Routes>
    </>
  )
}

export default App
