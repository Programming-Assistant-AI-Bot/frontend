import React from 'react'
import bgImage from '@/assets/images/bgImage.png'
import logo from '@/assets/images/logo.png'
import styles from '@/components/signup/SignUp.module.css'

function SignUpAdditionalInfo() {
  return (
    <div className={styles.pageContainer}>
      <div className='absolute bottom-0 left-0 right-0 h-[45%] bg-cover' style={{backgroundImage: `url(${bgImage})`}}/>
      <div className={styles.mainContainer}>
        <div className='h-[20%] w-full flex justify-center items-center'>
          <img src={logo} alt="logo" className='w-full max-h-full object-fill'  />
        </div>
        <div className='h-[80%] w-full'>
          <h1 className="text-3xl font-bold text-center m-8">Sign Up</h1>
          <form id="signupForm">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-sm font-semibold">Address</label>
                    <input type="text" id="firstName" className={styles.formInput} placeholder="No" required/>
                </div>
                <div class='pt-6'>
                    <input type="text" id="lastName" className={styles.formInput} placeholder="Street" required/>
                </div>
            </div>

            <div class="mt-2">
                <input type="email" id="text" className={styles.formInput} placeholder="City" required/>
            </div>

            <div class="mt-2">
                <input type="password" id="text" className={styles.formInput} placeholder="Country" required/>
            </div>

            <div class="mt-6">
                <label class="text-sm font-semibold">DOB</label>
                <input type="date" id="text" className={styles.formInput} placeholder="DOB" required />
            </div>

           
            <button type="submit" className={styles.submitButton}>
                Sign Up
            </button>
        </form>
        <div className={styles.loginLink}>Log in?</div>
        </div>

      </div>
    </div>
  )
}

export default SignUpAdditionalInfo