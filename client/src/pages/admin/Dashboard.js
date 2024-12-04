import React from 'react'
import Dashboard from '../../Components/Dashboard/Dashboard'
import Header from '../../Components/Header/Header'

const Dashbord = () => {
  return (
    <>
      <Header isAdmin={true} />
      <Dashboard/>
    </>
  )
}

export default Dashbord
