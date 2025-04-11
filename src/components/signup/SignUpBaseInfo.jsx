import React from 'react'
import bgImage from '@/assets/images/bgImage.png'
import logo from '@/assets/images/logo.png'
import styles from '@/components/signup/SignUp.module.css'
import { useNavigate } from 'react-router-dom'

function SignUpBaseInfo() {
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()
    navigate('/signup2')
  }
  
  return (
    <div className={styles.pageContainer}>
      <div className='absolute bottom-0 left-0 right-0 h-[45%] bg-cover' style={{backgroundImage: `url(${bgImage})`}}/>
      <div className={styles.mainContainer}>
        <div className='h-[20%] w-full flex justify-center items-center'>
          <img src={logo} alt="logo" className='w-full max-h-full object-fill'  />
        </div>
        <div className='h-[80%] w-full'>
          <h1 className="text-3xl font-bold text-center m-9">Sign Up</h1>
          <form id="signupForm" onSubmit={handleSubmit}>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-sm font-semibold">First Name</label>
                    <input type="text" id="firstName" className={styles.formInput} placeholder="First Name" required/>
                </div>
                <div>
                    <label class="text-sm font-semibold">Last Name</label>
                    <input type="text" id="lastName" className={styles.formInput} placeholder="Last Name" required/>
                </div>
            </div>

            <div class="mt-6">
                <label class="text-sm font-semibold">Email</label>
                <input type="email" id="email" className={styles.formInput} placeholder="Email" required/>
            </div>

            <div class="mt-6">
                <label class="text-sm font-semibold">Password</label>
                <input type="password" id="password" className={styles.formInput} placeholder="Password" required/>
            </div>

           
            <button type="submit" className={styles.submitButton}>
                Next
            </button>
        </form>
        <div className={styles.loginLink}>Log in?</div>
        </div>

      </div>
    </div>
  )
}

export default SignUpBaseInfo