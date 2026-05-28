import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [PToken, setPToken] = useState(localStorage.getItem('PToken') ? localStorage.getItem('PToken') : false)
    const [userData, setUserData] = useState(false)
    const [patData, setPatData] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [medicalRecords, setMedicalRecords] = useState([])
    const [invoices, setInvoices] = useState([])
    const [notifications, setNotifications] = useState([])

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadPatientProfileData = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pat/profile', {}, { headers: { PToken } })
            if (data.success) {
                setPatData(data.patientData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/appointments', {}, { headers: { token } })
            if (data.success) {
                setAppointments(data.appointments)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getPatientAppointments = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pat/appointments', {}, { headers: { PToken } })
            if (data.success) {
                setAppointments(data.appointments)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getPrescriptions = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pat/prescriptions', {}, { headers: { PToken } })
            if (data.success) {
                setPrescriptions(data.prescriptions)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getMedicalRecords = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pat/medical-records', {}, { headers: { PToken } })
            if (data.success) {
                setMedicalRecords(data.records)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getInvoices = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pat/invoices', {}, { headers: { PToken } })
            if (data.success) {
                setInvoices(data.invoices)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getNotifications = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/pat/notifications', {}, { headers: { PToken } })
            if (data.success) {
                setNotifications(data.notifications)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const calculateAge = (dob) => {
        if (!dob) return 'N/A'
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return 'N/A'
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        PToken, setPToken,
        backendUrl,
        userData, setUserData,
        patData, setPatData,
        loadUserProfileData,
        loadPatientProfileData,
        appointments,
        getUserAppointments,
        getPatientAppointments,
        prescriptions,
        getPrescriptions,
        medicalRecords,
        getMedicalRecords,
        invoices,
        getInvoices,
        notifications,
        getNotifications,
        calculateAge,
        slotDateFormat
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    useEffect(() => {
        if (PToken) {
            loadPatientProfileData()
            getPatientAppointments()
            getPrescriptions()
            getMedicalRecords()
            getInvoices()
            getNotifications()
        } else {
            setPatData(false)
        }
    }, [PToken])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider