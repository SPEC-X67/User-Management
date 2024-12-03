import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card bg-dark text-white" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Welcome Back!</h2>
            <p className="text-secondary">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-secondary small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label text-secondary small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-lock text-secondary"></i>
                </span>
                <input
                  type="password"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 py-2 mb-3">
              <i className="fas fa-sign-in-alt me-2"></i>
              Sign In
            </button>

            <div className="text-center">
              <p className="text-secondary mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-success text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
