import Chatbot from '@/components/chatBot/Chatbot';
import './App.css'
import SignUpBaseInfo from '@/components/signUp/SignUpBaseInfo';
import { Route,Routes } from 'react-router-dom';
import SignUpAdditionalInfo from './components/signup/SignUpAdditionalInfo';
import Homepage from './ComponentsTharundi/Homepage';
import { Toaster } from "sonner";
import Login from './components/login/Login';

function App() {

  return (
    <>

      /* <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path='/signup' element={<SignUpBaseInfo/>}/>
        <Route path='/signup2' element={<SignUpAdditionalInfo/>}/>
      </Routes> */
       <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/signup' element={<SignUpBaseInfo/>}/>
        <Route path='/signup2' element={<SignUpAdditionalInfo/>}/>
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
