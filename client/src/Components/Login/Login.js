import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/reducers/user/userSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);
  const [clientError, setClientError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful!');
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');
    
    // Form validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setClientError('*please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setClientError('*please enter a valid email address');
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
    } catch (err) {
      const errorMessage = err.message || err || "Login failed";
      setClientError('*' + errorMessage.toLowerCase());
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    setClientError('');
  };

  const handleNavigateToRegister = () => {
    dispatch(clearError());
    navigate('/register');
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card bg-dark text-white" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Welcome Back!</h2>
            <p className="text-secondary">Please sign in to continue</p>
          </div>

          {(clientError || error) && (
            <div className="alert alert-danger" role="alert">
              {clientError || error}
            </div>
          )}

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
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-success w-100 py-2 mb-3"
              disabled={loading}
              style={{
                background: 'linear-gradient(45deg, #4cd964, #2ecc71)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)',
              }}
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin me-2"></i>
              ) : (
                <i className="fas fa-sign-in-alt me-2"></i>
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center">
              <p className="text-secondary mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-success text-decoration-none" onClick={handleNavigateToRegister}>
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
