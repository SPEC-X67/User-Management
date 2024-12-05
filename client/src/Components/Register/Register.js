import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/reducers/user/userSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    gender: '',
    profile: null
  });
  const [clientError, setClientError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error: serverError, isAuthenticated} = useSelector(state => state.user);

  useEffect(() => {
    if (serverError) {
      toast.error(serverError.toLowerCase());
    }
  }, [serverError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setClientError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setClientError('*please select an image file');
        return;
      }
      setFormData({ ...formData, profile: file });
      setPreviewUrl(URL.createObjectURL(file));
      setClientError('');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name.trim() || !formData.password.trim()) {
          setClientError('*name and password are required');
          return false;
        }
        if (formData.password.length < 6) {
          setClientError('*password must be at least 6 characters');
          return false;
        }
        break;
      case 2:
        if (!formData.email.trim() || !formData.city.trim() || !formData.gender.trim()) {
          setClientError('*email, city and gender are required');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setClientError('*please enter a valid email address');
          return false;
        }
        break;
      case 3:
        if (!formData.profile) {
          setClientError('*please select a profile picture');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setClientError('');
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setClientError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateStep(currentStep)) return;

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      dispatch(registerUser(data)).unwrap()
        .then(() => {
          navigate('/');
          toast.success('Registration successful!');
        })
        .catch(err => {
          setClientError('*' + err.toLowerCase());
        });
    } catch (err) {
      setClientError('*' + err.toLowerCase());
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-user text-secondary"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-lock text-secondary"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">City</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-map-marker-alt text-secondary"></i>
                </span>
                <input
                  type="text"
                  name="city"
                  className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary">
                  <i className="fas fa-venus-mars text-secondary"></i>
                </span>
                <select
                  name="gender"
                  className="form-select bg-dark text-white border-secondary rounded-0 rounded-end"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <div className="text-center mb-4">
            <div className="position-relative d-inline-block">
              <img
                src={previewUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <label
                htmlFor="profile"
                className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                style={{ cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fas fa-camera text-white"></i>
              </label>
            </div>
            <input
              type="file"
              id="profile"
              name="profile"
              className="d-none"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ height: '100vh', padding: '20px 0' }}>
      <div className="card bg-dark text-white" style={{ maxWidth: '450px', width: '100%', maxHeight: '600px', position: 'relative' }}>
        {/* Fixed Header */}
        <div className="card-header bg-dark border-0 text-center" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <div className="mb-3">
            <i className="fas fa-user-circle fa-3x text-success mb-2"></i>
          </div>
          <h2 className="fw-bold mb-2">Register New User</h2>
          <p className="text-secondary">Step {currentStep} of 3</p>
          
          {/* Progress Bar */}
          <div className="progress bg-dark mb-4" style={{ height: '4px' }}>
            <div
              className="progress-bar bg-success"
              style={{
                width: `${(currentStep / 3) * 100}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            ></div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="card-body p-4" style={{ 
          overflowY: 'auto', 
          height: 'calc(100% - 160px)', 
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {clientError && (
            <div className="alert alert-danger" role="alert">
              {clientError}
            </div>
          )}

          <form id="registerForm" onSubmit={(e) => e.preventDefault()}>
            {renderStep()}
          </form>
        </div>

        {/* Fixed Footer with Navigation Buttons */}
        <div className="card-footer bg-dark border-0 text-center p-3" style={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
          <div className="d-flex gap-2 justify-content-between">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-outline-light px-4"
                onClick={prevStep}
                disabled={loading}
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                className="btn btn-success px-4"
                onClick={nextStep}
                disabled={loading}
                style={{
                  background: 'linear-gradient(45deg, #4cd964, #2ecc71)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)',
                  marginLeft: currentStep === 1 ? 'auto' : '0'
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success px-4"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: 'linear-gradient(45deg, #4cd964, #2ecc71)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)',
                  marginLeft: 'auto'
                }}
              >
                {loading ? "Registering..." : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;