import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const Rooms = () => {
  const { aToken, rooms, getRooms } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getRooms()
    }
  }, [aToken])

  return (
    <div className='m-5'>
      <p className='mb-3 text-lg font-medium'>Rooms Management</p>

      <div className='bg-white border rounded text-sm'>
        <div className='hidden sm:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Room #</p>
          <p>Ward</p>
          <p>Type</p>
          <p>Status</p>
          <p>Price/Day</p>
        </div>

        {rooms && rooms.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <p>{item.roomNumber}</p>
            <p>{item.wardId?.name || 'N/A'}</p>
            <p>{item.type}</p>
            <p>
              <span className={`px-2 py-1 text-xs rounded ${
                item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.available ? 'Available' : 'Occupied'}
              </span>
            </p>
            <p>${item.pricePerDay}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rooms