// src/App.jsx
import Chatbot from '@/components/chatBot/Chatbot';
import './App.css';
import SignUpBaseInfo from '@/components/signUp/SignUpBaseInfo';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignUpAdditionalInfo from './components/signup/SignUpAdditionalInfo';
import Homepage from './ComponentsTharundi/Homepage';
import { Toaster } from "sonner";
import Login from './components/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<SignUpBaseInfo />} />
        <Route path="/signup2" element={<SignUpAdditionalInfo />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

export default App;