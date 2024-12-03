import React from 'react'

const Header = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid" style={{height: "50px"}}>
        <h1 className="navbar-brand fw-bold fs-4 mx-2" >WoiTap</h1>
        <button className="btn btn-outline-light">
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Header
