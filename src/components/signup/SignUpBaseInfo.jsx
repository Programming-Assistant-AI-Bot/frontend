import React from 'react'
import bgImage from '@/assets/images/bgImage.png'
import logo from '@/assets/images/logo.png'

function SignUpBaseInfo() {
  return (
    <div className='bg-[#D9D9D9] h-screen w-screen relative flex items-center justify-center'>
      <div className='absolute bottom-0 left-0 right-0 h-[45%] bg-cover' style={{backgroundImage: `url(${bgImage})`}}/>
      <div className='relative z-10 w-[35%] bg-white h-[95%] rounded-xl p-[3%] flex shadow-lg flex-col'>
        <div className='h-[20%] w-full flex justify-center items-center'>
          <img src={logo} alt="logo" className='w-full max-h-full object-fill'  />
        </div>
        <div className='h-[80%] w-full'>
          <h1 className="text-3xl font-bold text-center m-9">Sign Up</h1>
          <form id="signupForm">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-sm font-semibold">First Name</label>
                    <input type="text" id="firstName" class="w-full p-2 border rounded-lg" placeholder="First Name" required/>
                </div>
                <div>
                    <label class="text-sm font-semibold">Last Name</label>
                    <input type="text" id="lastName" class="w-full p-2 border rounded-lg" placeholder="Last Name" required/>
                </div>
            </div>

            <div class="mt-6">
                <label class="text-sm font-semibold">Email</label>
                <input type="email" id="email" class="w-full p-2 border rounded-lg" placeholder="Email" required/>
            </div>

            <div class="mt-6">
                <label class="text-sm font-semibold">Password</label>
                <input type="password" id="password" class="w-full p-2 border rounded-lg" placeholder="Password" required/>
            </div>

           
            <button type="submit" class="bg-[#481E7B] text-white w-[60%] py-2 rounded-lg mt-6 hover:bg-purple-800 block mx-auto">
                Next
            </button>
        </form>
        <div className='text-[#481E7B] mt-6 mx-auto block text-center'>Log in?</div>
        </div>

      </div>
    </div>
  )
}

export default SignUpBaseInfo