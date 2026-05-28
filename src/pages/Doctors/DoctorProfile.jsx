import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorProfile = () => {
    const { dToken, profileData, getProfileData, updateSchedule } = useContext(DoctorContext)
    const { slotDateFormat } = useContext(AppContext)
    
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState({
        fees: '',
        address: '',
        available: true,
        schedule: {}
    })

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    useEffect(() => {
        if (profileData) {
            setEditData({
                fees: profileData.fees || '',
                address: profileData.address ? JSON.stringify(profileData.address) : '',
                available: profileData.available,
                schedule: profileData.schedule || {}
            })
        }
    }, [profileData])

    const handleSave = async () => {
        // Update logic would go here
        setIsEdit(false)
    }

    return profileData ? (
        <div className='m-5 w-full max-w-4xl'>
            <p className='mb-3 text-lg font-medium'>Doctor Profile</p>
            
            <div className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center gap-6 mb-6'>
                    <img 
                        src={profileData.image} 
                        alt={profileData.name} 
                        className='w-32 h-32 rounded-full object-cover'
                    />
                    <div>
                        <h2 className='text-2xl font-bold'>{profileData.name}</h2>
                        <p className='text-gray-600'>{profileData.speciality}</p>
                        <p className='text-gray-500'>{profileData.degree}</p>
                        <p className='text-sm mt-2'>{profileData.experience} experience</p>
                    </div>
                </div>

                <div className='border-t pt-4'>
                    <h3 className='font-semibold mb-3'>About</h3>
                    <p className='text-gray-700 mb-4'>{profileData.about}</p>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <p className='text-sm text-gray-500'>Appointment Fee</p>
                            <p className='font-medium'>${profileData.fees}</p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Availability</p>
                            <span className={`px-2 py-1 text-xs rounded ${
                                profileData.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {profileData.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>

                    {profileData.address && (
                        <div className='mt-4'>
                            <p className='text-sm text-gray-500'>Address</p>
                            <p>{profileData.address.line1}</p>
                            <p>{profileData.address.line2}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    )
}

export default DoctorProfile