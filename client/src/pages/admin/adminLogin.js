import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../redux/reducers/admin/adminSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.admin);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if(isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginAdmin(formData)).unwrap();
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
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
            <div className="display-1 mb-3">
              <i className="fas fa-user-shield text-success"></i>
            </div>
            <h2 className="fw-bold mb-2">Admin Login</h2>
            <p className="text-secondary">Access admin dashboard</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-secondary small">Admin Email</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  id="email"
                  name="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label text-secondary small">Admin Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-lock text-secondary"></i>
                </span>
                <input
                  type="password"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  id="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-success w-100 py-2 mb-3"
              style={{ 
                background: 'linear-gradient(45deg, #4cd964, #2ecc71)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)'
              }}
              disabled={loading}
            >
              {loading ? (
                 <i className="fas fa-spinner fa-spin me-2"></i>
              ) : (
                <i className="fas fa-sign-in-alt me-2"></i>
              )}
              {loading ? 'Loging..' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
