import { createContext, useState, useEffect } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [medicalRecords, setMedicalRecords] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [notifications, setNotifications] = useState([])

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/completed', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/dashboard', { docId: getDocId() }, { headers: { dToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDocId = () => {
        try {
            const token = localStorage.getItem('dToken')
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]))
                return payload.id
            }
        } catch (e) {
            return null
        }
    }

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            if (data.success) {
                setProfileData(data.profileData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const createMedicalRecord = async (recordData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/create-medical-record', recordData, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getMedicalRecords()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const createPrescription = async (prescriptionData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/create-prescription', prescriptionData, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getPrescriptions()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getMedicalRecords = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/patient-history', { docId: getDocId() }, { headers: { dToken } })
            if (data.success) {
                setMedicalRecords(data.appointments)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getPrescriptions = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/prescriptions', { headers: { dToken } })
            if (data.success) {
                setPrescriptions(data.prescriptions)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getNotifications = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/notifications', { docId: getDocId() }, { headers: { dToken } })
            if (data.success) {
                setNotifications(data.notifications)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const updateSchedule = async (schedule) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/update-schedule', { docId: getDocId(), schedule }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
        createMedicalRecord,
        createPrescription,
        medicalRecords,
        getMedicalRecords,
        prescriptions,
        getPrescriptions,
        notifications,
        getNotifications,
        updateSchedule
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider