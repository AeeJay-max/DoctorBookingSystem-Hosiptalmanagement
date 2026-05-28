import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [department, setDepartment] = useState('General')

    const { backendUrl, setAToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/register', {
                name, email, password, phone, department
            })
            if (data.success) {
                localStorage.setItem('aToken', data.token)
                setAToken(data.token)
                toast.success('Admin registered successfully')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Registration failed')
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'>Admin <span className='text-primary'>Sign Up</span></p>
                <div className='w-full'>
                    <p>Full Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
                </div>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                </div>
                <div className='w-full'>
                    <p>Phone</p>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" />
                </div>
                <div className='w-full'>
                    <p>Department</p>
                    <select onChange={(e) => setDepartment(e.target.value)} value={department} className='border border-[#DADADA] rounded w-full p-2 mt-1'>
                        <option value="General">General</option>
                        <option value="Emergency">Emergency</option>
                        <option value="ICU">ICU</option>
                        <option value="Maternity">Maternity</option>
                        <option value="Pediatric">Pediatric</option>
                    </select>
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Sign Up</button>
                <p className='text-center w-full'>
                    Already have an account? <span className='text-primary underline cursor-pointer' onClick={() => window.location.href = '/login'}>Login here</span>
                </p>
            </div>
        </form>
    )
}

export default Signup