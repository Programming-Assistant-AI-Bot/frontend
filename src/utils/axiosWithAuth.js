import axios from 'axios';

export default function axiosWithAuth() {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
}

// Special function for form data that requires different Content-Type
export function axiosWithAuthFormData() {
  const token = localStorage.getItem('token');
  
  return axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
}