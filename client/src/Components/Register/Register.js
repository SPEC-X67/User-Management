import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/reducers/userSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    city: '',
    profile: null
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      console.error('Failed to register user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-dark border-0 shadow">
            <div className="card-body p-4">
              <div className="mb-4">
                <h2 className="h3 text-white mb-2">Register New User</h2>
                <p className="text-secondary mb-0">Create a new user profile</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={previewUrl || 'https://via.placeholder.com/150'}
                      alt="Profile Preview"
                      className="rounded-circle"
                      style={{ 
                        width: '120px', 
                        height: '120px', 
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

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label text-secondary small">Full Name</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        style={{ padding: '0.75rem' }}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label text-secondary small">Email Address</label>
                      <input
                        type="email"
                        className="form-control bg-dark text-white border-secondary"
                        style={{ padding: '0.75rem' }}
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label text-secondary small">Password</label>
                      <input
                        type="password"
                        className="form-control bg-dark text-white border-secondary"
                        style={{ padding: '0.75rem' }}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label text-secondary small">City</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        style={{ padding: '0.75rem' }}
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label text-secondary small d-block mb-3">Gender</label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="male"
                            name="gender"
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label text-white" htmlFor="male">
                            Male
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="female"
                            name="gender"
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label text-white" htmlFor="female">
                            Female
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="other"
                            name="gender"
                            value="Other"
                            checked={formData.gender === 'Other'}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label text-white" htmlFor="other">
                            Other
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn btn-success px-4 py-2"
                    style={{ minWidth: '140px' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light px-4"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;