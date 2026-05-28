import { createContext, useState, useEffect } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [patients, setPatients] = useState([])
    const [wards, setWards] = useState([])
    const [rooms, setRooms] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [medicalRecords, setMedicalRecords] = useState([])
    const [invoices, setInvoices] = useState([])
    const [payments, setPayments] = useState([])
    const [dashData, setDashData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Axios interceptor for token expiry
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.data?.message?.includes('expired') || error.response?.status === 401) {
                    localStorage.removeItem('aToken')
                    localStorage.removeItem('dToken')
                    window.location.href = '/login'
                }
                return Promise.reject(error)
            }
        )

        return () => axios.interceptors.response.eject(interceptor)
    }, [])

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const gettAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/appointment-cancel', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                gettAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const approveAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/appointment-approve', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                gettAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getPatients = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/patients', { headers: { aToken } })
            if (data.success) {
                setPatients(data.patients)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getWards = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/wards', { headers: { aToken } })
            if (data.success) {
                setWards(data.wards)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getRooms = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/rooms', { headers: { aToken } })
            if (data.success) {
                setRooms(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getPrescriptions = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/prescriptions', { headers: { aToken } })
            if (data.success) {
                setPrescriptions(data.prescriptions)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getMedicalRecords = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/medical-records', { headers: { aToken } })
            if (data.success) {
                setMedicalRecords(data.records)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getInvoices = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/invoices', { headers: { aToken } })
            if (data.success) {
                setInvoices(data.invoices)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getPayments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/payments', { headers: { aToken } })
            if (data.success) {
                setPayments(data.payments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setAToken('')
                localStorage.removeItem('aToken')
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const value = {
        aToken, setAToken,
        backendUrl,
        doctors, setDoctors,
        getAllDoctors,
        changeAvailability,
        appointments, setAppointments,
        gettAllAppointments,
        cancelAppointment,
        approveAppointment,
        dashData,
        getDashData,
        patients,
        getPatients,
        wards,
        getWards,
        rooms,
        getRooms,
        prescriptions,
        getPrescriptions,
        medicalRecords,
        getMedicalRecords,
        invoices,
        getInvoices,
        payments,
        getPayments
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider