import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'

const PatientDashboard = () => {
    const { patData, appointments, prescriptions, invoices, dashData } = useContext(AppContext)

    return patData ? (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
                <div className="flex items-center gap-4">
                    <img 
                        src={patData.image || '/default-avatar.png'} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full"
                    />
                    <div>
                        <p className="text-xl font-medium">{patData.name}</p>
                        <p className="text-gray-600">{patData.email}</p>
                        <p className="text-gray-600">{patData.phone}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Appointments</p>
                    <p className="text-2xl font-bold">{appointments?.length || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Prescriptions</p>
                    <p className="text-2xl font-bold">{prescriptions?.length || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Unpaid Invoices</p>
                    <p className="text-2xl font-bold">
                        ${invoices?.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0) || 0}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
                <div className="space-y-3">
                    {appointments?.filter(a => !a.cancelled && !a.isCompleted).slice(0, 5).map((appointment, index) => (
                        <div key={index} className="border p-3 rounded flex justify-between items-center">
                            <div>
                                <p className="font-medium">{appointment.docData?.name}</p>
                                <p className="text-sm text-gray-500">{appointment.docData?.speciality}</p>
                                <p className="text-xs">{appointment.slotDate}, {appointment.slotTime}</p>
                            </div>
                            <span className="text-primary text-sm">Pending</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    )
}

export default PatientDashboard