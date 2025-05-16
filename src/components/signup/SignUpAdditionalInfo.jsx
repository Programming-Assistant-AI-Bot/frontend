import React from 'react'
import bgImage from '@/assets/images/bgImage.png'
import logo from '@/assets/images/logo.png'
import styles from '@/components/signup/SignUp.module.css'
import { useNavigate } from 'react-router-dom'

function SignUpAdditionalInfo() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Get base info from localStorage (set in SignUpBaseInfo.jsx)
    const userData = JSON.parse(localStorage.getItem('signup_user_data'))

    if (!userData) {
      alert('Missing signup information. Please start from the beginning.')
      navigate('/signup')
      return
    }

    const [first_name, last_name] = userData.username.split(' ')
    const email = userData.email
    const password = userData.password

    // Get additional info from inputs
    const no = document.getElementById('No').value
    const street = document.getElementById('Street').value
    const city = document.getElementById('City').value
    const country = document.getElementById('Country').value
    const dob = document.getElementById('DOB').value

    // Combine into single object (adjust this depending on your backend schema)
    const signupData = {
      username: `${first_name} ${last_name}`, // Combine names as username
      email,
      password,
    }

    fetch('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Signup failed')
        return res.json()
      })
      .then(() => {
        alert('Signup successful!')
        navigate('/login')
      })
      .catch((err) => {
        console.error(err)
        alert('Signup failed. Try again.')
      })
      navigate('/login')
  }

  return (
    <div className={styles.pageContainer}>
      <div className='absolute bottom-0 left-0 right-0 h-[45%] bg-cover' style={{ backgroundImage: `url(${bgImage})` }} />
      <div className={styles.mainContainer}>
        <div className='h-[20%] w-full flex justify-center items-center'>
          <img src={logo} alt="logo" className='w-full max-h-full object-fill' />
        </div>
        <div className='h-[80%] w-full'>
          <h1 className="text-3xl font-bold text-center m-8">Sign Up</h1>
          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Address</label>
                <input type="text" id="No" className={styles.formInput} placeholder="No" required />
              </div>
              <div className="pt-6">
                <input type="text" id="Street" className={styles.formInput} placeholder="Street" required />
              </div>
            </div>

            <div className="mt-2">
              <input type="text" id="City" className={styles.formInput} placeholder="City" required />
            </div>

            <div className="mt-2">
              <input type="text" id="Country" className={styles.formInput} placeholder="Country" required />
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold">DOB</label>
              <input type="date" id="DOB" className={styles.formInput} placeholder="DOB" required />
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign Up
            </button>
          </form>
          <div className={styles.loginLink} onClick={() => navigate("/login")}>Log in?</div>
        </div>
      </div>
    </div>
  )
}

export default SignUpAdditionalInfo
