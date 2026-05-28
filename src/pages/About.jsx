import React from 'react'
import { assets } from '../assets/assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>About <span className='text-gray-700 font-medium'>Us</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to <strong>HealthLink Zim</strong> a secure, trusted and modern digital platform that connects patients to qualified doctors, clinics, hospitals and pharmacies across Zimbabwe.<br />We help you book appointments, access medical services, and find the right healthcare provider <strong>anytime, anywhere</strong> without standing in queues or wasting time.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>To make healthcare accessible and efficient for every Zimbabwean by bridging the gap between patients and healthcare providers through technology.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Aiming to become Zimbabwe's most trusted health-tech partner and expand across Africa thereby empowering hospitals, clinics, pharmacies and communities with simple, affordable and reliable healthcare access.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>Why <span className='text-gray-700 font-semibold'>Choose Us</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>We reduce waiting times and paperwork by letting patients book doctor appointments and order medicines from partnered pharmacies online, saving time for everyone.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Our platform works 24/7, giving you the freedom to find, compare, and book healthcare services or order prescriptions anytime from your phone or computer.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalisation:</b>
          <p>Patients get tailored doctor and pharmacy recommendations, prescription reminders, and secure profiles — making healthcare and medicine access simpler and more personal.</p>

        </div>
      </div>

    </div>
  )
}

export default About
