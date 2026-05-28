import React, { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'

const Prescriptions = () => {
  const { dToken, prescriptions, getPrescriptions } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) {
      getPrescriptions()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>Prescriptions</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_2fr_2fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Medicines</p>
          <p>Date</p>
          <p>Actions</p>
        </div>

        {prescriptions && prescriptions.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_2fr_2fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <p>{item.patientId?.name || 'N/A'}</p>
            <p>{item.medicines?.length} medicines</p>
            <p>{new Date(item.date).toDateString()}</p>
            <button className='text-primary text-xs'>View</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Prescriptions