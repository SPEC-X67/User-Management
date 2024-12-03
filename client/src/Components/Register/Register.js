import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/reducers/userSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    gender: '',
    profile: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/');
    } catch (error) {
      console.error("Failed to register", error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card bg-dark text-white" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Register New User</h2>
            <p className="text-secondary">Create a new user profile</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img
                  src={previewUrl || 'https://via.placeholder.com/150'}
                  alt="Profile Preview"
                  className="rounded-circle"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '3px solid #2a2d2e'
                  }}
                />
                <label
                  className="btn btn-success btn-sm position-absolute bottom-0 end-0 rounded-circle"
                  style={{
                    width: '32px',
                    height: '32px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '8px'
                  }}
                >
                  <i className="fas fa-camera"></i>
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={handleFileChange}
                    name="profile"
                  />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-user text-secondary"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label text-secondary small">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-lock text-secondary"></i>
                </span>
                <input
                  type="password"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label text-secondary small">City</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-map-marker-alt text-secondary"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary rounded-0 rounded-end text-white"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="form-label text-secondary small">Gender</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-venus-mars text-secondary"></i>
                </span>
                <select
                  className="form-select bg-dark border-secondary rounded-0 rounded-end text-white"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
            > {loading ? ("Registering...") : (
              <>              
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </>
            ) }
            </button>

            <div className="text-center">
              <p className="text-secondary mb-0">
                Already have an account?{' '}
                <Link to="/" className="text-success text-decoration-none">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;