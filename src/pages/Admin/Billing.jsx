import React, { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'

const Billing = () => {
    const { invoices, getInvoices } = useContext(AdminContext)

    React.useEffect(() => {
        getInvoices()
    }, [])

    return (
        <div className='m-5'>
            <p className='mb-3 text-lg font-medium'>Billing & Invoices</p>

            <div className='bg-white border rounded text-sm'>
                <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Total</p>
                    <p>Paid</p>
                    <p>Status</p>
                    <p>Date</p>
                </div>

                {invoices && invoices.map((item, index) => (
                    <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                        <p>{index + 1}</p>
                        <p>{item.patientId?.name || 'N/A'}</p>
                        <p>${item.totalAmount}</p>
                        <p>${item.paidAmount}</p>
                        <p>
                            <span className={`px-2 py-1 text-xs rounded ${
                                item.status === 'paid' ? 'bg-green-100 text-green-800' :
                                item.status === 'partially-paid' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {item.status}
                            </span>
                        </p>
                        <p>{new Date(item.date).toDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Billing