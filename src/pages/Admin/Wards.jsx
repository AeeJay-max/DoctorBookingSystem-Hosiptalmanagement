import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Wards = () => {
  const { aToken, wards, getWards, addWard } = useContext(AdminContext)
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('General')
  const [totalRooms, setTotalRooms] = useState('')
  const [floor, setFloor] = useState('')

  useEffect(() => {
    if (aToken) {
      getWards()
    }
  }, [aToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await axios.post(aToken ? import.meta.env.VITE_BACKEND_URL + '/api/admin/add-ward' : '', { 
      name, type, totalRooms, floor 
    }, { headers: { aToken } })
    
    if (data.success) {
      toast.success(data.message)
      setShowAdd(false)
      getWards()
    } else {
      toast.error(data.message)
    }
  }

  return (
    <div className='m-5'>
      <div className='flex justify-between items-center mb-4'>
        <p className='text-lg font-medium'>Wards Management</p>
        <button onClick={() => setShowAdd(true)} className='bg-primary text-white px-4 py-2 rounded'>Add Ward</button>
      </div>

      {showAdd && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-96'>
            <h3 className='text-lg font-semibold mb-4'>Add New Ward</h3>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='block mb-1'>Ward Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className='w-full border p-2 rounded' required />
              </div>
              <div className='mb-3'>
                <label className='block mb-1'>Ward Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className='w-full border p-2 rounded'>
                  <option value="ICU">ICU</option>
                  <option value="General">General</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>
              <div className='mb-3'>
                <label className='block mb-1'>Total Rooms</label>
                <input type="number" value={totalRooms} onChange={(e) => setTotalRooms(e.target.value)} className='w-full border p-2 rounded' required />
              </div>
              <div className='mb-3'>
                <label className='block mb-1'>Floor</label>
                <input value={floor} onChange={(e) => setFloor(e.target.value)} className='w-full border p-2 rounded' />
              </div>
              <div className='flex gap-2 justify-end'>
                <button type="button" onClick={() => setShowAdd(false)} className='px-4 py-2 border rounded'>Cancel</button>
                <button type="submit" className='bg-primary text-white px-4 py-2 rounded'>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='bg-white border rounded text-sm'>
        <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Ward Name</p>
          <p>Type</p>
          <p>Total Rooms</p>
          <p>Occupied</p>
        </div>

        {wards && wards.map((item, index) => (
          <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p>{index + 1}</p>
            <p>{item.name}</p>
            <p>{item.type}</p>
            <p>{item.totalRooms}</p>
            <p>{item.occupiedRooms}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wards