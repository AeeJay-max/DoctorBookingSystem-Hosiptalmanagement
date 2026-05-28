import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const AddPatient = () => {

    const { backendUrl, doctors, aToken, getAllDoctors } = useContext(AdminContext)
    const [selectedDoctor, setSelectedDoctor] = useState("")

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    useEffect(() => {
        if (doctors.length > 0 && !selectedDoctor) {
            setSelectedDoctor(doctors[0]._id)
        }
    }, [doctors, selectedDoctor])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [idnumber, setIdnumber] = useState('')
    const [ward, setWard] = useState('')
    const [roomnumber, setRoomnumber] = useState('')
    const [dob, setDob] = useState('')
    const [kin, setKin] = useState('')
    const [condition, setCondition] = useState('')
    const [phone, setPhone] = useState('')
    const [date, setDate] = useState('')
    const [gender, setGender] = useState('')
    const [disease, setDisease] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            const formData = new FormData()

            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('idnumber', idnumber)
            formData.append('ward', ward)
            formData.append('roomnumber', Number(roomnumber))
            formData.append('dob', dob)
            formData.append('kin', kin)
            formData.append('doctor', selectedDoctor)
            formData.append('condition', condition)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('phone', phone)
            formData.append('gender', gender)
            formData.append('disease', disease)
            formData.append('date', date)

            const { data } = await axios.post(backendUrl + '/api/admin/add-patient', formData, {
                headers: {
                    aToken,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {

        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Patient</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Full Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type='text' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type='email' required placeholder='patient@gmail.com' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type='password' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>ID Number</p>
                            <input onChange={(e) => setIdnumber(e.target.value)} value={idnumber} className='border rounded px-3 py-2' type='text' required placeholder='00-0000000M00' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Phone Number</p>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border rounded px-3 py-2' type='text' required placeholder='+263 77 777 7777' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Gender</p>
                            <select onChange={(e) => setGender(e.target.value)} value={gender} className='border rounded px-3 py-2' required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Ward</p>
                            <input onChange={(e) => setWard(e.target.value)} value={ward} className='border rounded px-3 py-2' type='text' required placeholder='N1' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Room Number</p>
                            <input onChange={(e) => setRoomnumber(e.target.value)} value={roomnumber} className='border rounded px-3 py-2' type='text' required placeholder='302' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Doctor</p>
                            <select onChange={(e) => setSelectedDoctor(e.target.value)} value={selectedDoctor} className='border rounded px-3 py-2' required>
                                <option value="">Select Doctor</option>
                                {doctors && doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Date of Birth</p>
                            <input onChange={(e) => setDob(e.target.value)} value={dob} className='border rounded px-3 py-2' type='date' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Next of Kin Phone Number</p>
                            <input onChange={(e) => setKin(e.target.value)} value={kin} className='border rounded px-3 py-2' type='text' required placeholder='+263 77 777 7777' />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Date Admitted</p>
                            <input onChange={(e) => setDate(e.target.value)} value={date} className='border rounded px-3 py-2' type='date' required />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 mt-4 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <p>Disease</p>
                            <input onChange={(e) => setDisease(e.target.value)} value={disease} className='border rounded px-3 py-2' type='text' placeholder='Injury' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Condition</p>
                            <select onChange={(e) => setCondition(e.target.value)} value={condition} className='border rounded px-3 py-2'>
                                <option value="Mild">Mild</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Severe">Severe</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type='text' placeholder="Street / Area" required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type='text' placeholder="City / State" required />
                        </div>
                    </div>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-6 text-white rounded-full'>
                    Add Patient
                </button>
            </div>
        </form>
    )
}

export default AddPatient
