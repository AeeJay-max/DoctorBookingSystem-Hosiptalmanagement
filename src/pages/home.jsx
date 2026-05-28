import React from 'react'
import Header from '../components/Header'
import SpecialityPage from '../components/SpecialityPage'
import BestDoctors from '../components/BestDoctors'
import Banner from '../components/Banner'

const home = () => {
  return (
    <div>
        <Header />
        <SpecialityPage/>
        <BestDoctors />
        <Banner />
    </div>
  )
}

export default home
