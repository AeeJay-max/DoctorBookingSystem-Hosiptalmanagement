import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Patients = () => {
  const { aToken, patients, getPatients } = useContext(AdminContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getPatients()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Patients</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_2fr_2fr_2fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Name</p>
          <p>Age</p>
          <p>Contact</p>
          <p>Status</p>
          <p>Ward/Room</p>
          <p>Actions</p>
        </div>

        {patients && patients.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_2fr_2fr_2fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={item.image || '/default-avatar.png'} alt="" />
              <p>{item.name}</p>
            </div>
            <p>{calculateAge(item.dob)}</p>
            <p>{item.phone || 'N/A'}</p>
            <p>
              <span className={`px-2 py-1 text-xs rounded ${
                item.status === 'admitted' ? 'bg-green-100 text-green-800' :
                item.status === 'discharged' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </p>
            <p>{item.ward?.name || 'N/A'} / {item.roomnumber?.roomNumber || 'N/A'}</p>
            <div className='flex gap-2'>
              <button className='text-primary text-xs'>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Patients