import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import DoctorsList from './pages/Admin/DoctorsList';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctors/DoctorDashboard';
import DoctorAppointments from './pages/Doctors/DoctorAppointments';
import DoctorProfile from './pages/Doctors/DoctorProfile';
import AddPatient from './pages/Admin/AddPatient';
import Patients from './pages/Admin/Patients';
import Wards from './pages/Admin/Wards';
import Rooms from './pages/Admin/Rooms';
import Billing from './pages/Admin/Billing';
import MedicalRecords from './pages/Doctors/MedicalRecords';
import Prescriptions from './pages/Doctors/Prescriptions';
import Signup from './pages/Admin/Signup';

const App = () => {

    const { aToken, getDashData } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    React.useEffect(() => {
        const checkTokenExpiry = () => {
            if (aToken) {
                try {
                    const payload = JSON.parse(atob(aToken.split('.')[1]))
                    const expiryTime = payload.exp * 1000
                    if (Date.now() > expiryTime) {
                        localStorage.removeItem('aToken')
                        window.location.reload()
                    }
                } catch (e) {
                    localStorage.removeItem('aToken')
                    window.location.reload()
                }
            }
            if (dToken) {
                try {
                    const payload = JSON.parse(atob(dToken.split('.')[1]))
                    const expiryTime = payload.exp * 1000
                    if (Date.now() > expiryTime) {
                        localStorage.removeItem('dToken')
                        window.location.reload()
                    }
                } catch (e) {
                    localStorage.removeItem('dToken')
                    window.location.reload()
                }
            }
        }
        
        const interval = setInterval(checkTokenExpiry, 60000)
        return () => clearInterval(interval)
    }, [aToken, dToken])

    return aToken || dToken ? (
        <div className='bg-[#F8F9FD]'>
            <ToastContainer />
            <Navbar />
            <div className='flex items-start'>
                <Sidebar />
                <div className='flex-1 p-5'>
                    <Routes>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/admin-dashboard' element={<Dashboard />} />
                        <Route path='/all-appointments' element={<AllAppointments />} />
                        <Route path='/doctors-list' element={<DoctorsList />} />
                        <Route path='/add-doctor' element={<AddDoctor />} />
                        <Route path='/addpatient' element={<AddPatient />} />
                        <Route path='/patients' element={<Patients />} />
                        <Route path='/wards' element={<Wards />} />
                        <Route path='/rooms' element={<Rooms />} />
                        <Route path='/billing' element={<Billing />} />
                        <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                        <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                        <Route path='/doctor-profile' element={<DoctorProfile />} />
                        <Route path='/doctor-prescriptions' element={<Prescriptions />} />
                        <Route path='/doctor-medical-records' element={<MedicalRecords />} />
                    </Routes>
                </div>
            </div>
        </div>
    ) : (
        <>
            <ToastContainer />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='*' element={<Navigate to="/login" />} />
            </Routes>
        </>
    )
}

export default App