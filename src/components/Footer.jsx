import React from 'react'
import { assets } from '../assets/assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* ------- Left Side ------- */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            HealthLink Zim connects patients with trusted doctors, hospitals, clinics and pharmacies across the country. Book appointments easily and securely thereby empowering better healthcare access for all Zimbabweans.
          </p>
        </div>

        {/* ------- Center -------*/}
        <div>
          <p className='text-xl font-medium mb-5'>Company</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>Credits</li>
            <li>Contact Developer</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* ------- Right Side ------- */}
        <div>
          <p className='text-xl font-medium mb-5'>Get In Touch</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+263 718 711 250</li>
            <li>tatendaajmakura@gmail.com</li>
          </ul>
        </div>
      </div>

      {/*------- Copyright Text -------*/}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          © 2025 HealthLink Zim — All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
