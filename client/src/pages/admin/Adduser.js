import React, { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearError } from "../../redux/reducers/admin/adminSlice";
import toast from 'react-hot-toast';

const AddUser = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [clientError, setClientError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { loading, error: serverError } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    city: "",
    profile: null,
  });

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setPreviewUrl(URL.createObjectURL(file));
      setClientError(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setClientError(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      gender: "",
      city: "",
      profile: null,
    });
    setPreviewUrl(null);
    setClientError(null);
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError(null);
    dispatch(clearError());
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || 
        !formData.gender.trim() || !formData.city.trim() || !formData.profile) {
      setClientError('*please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setClientError('*please enter a valid email address');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setClientError('*password must be at least 6 characters long');
      return;
    }

    // City validation - only letters and spaces allowed
    const cityRegex = /^[A-Za-z\s]+$/;
    if (!cityRegex.test(formData.city.trim())) {
      setClientError('*Enter a valid city name');
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const result = await dispatch(addUser(data)).unwrap();
      if (result && result.success) {
        toast.success('User added successfully');
        resetForm();
        onHide();
      } else {
        throw new Error(result.message || 'Failed to add user');
      }
    } catch (error) {
      const errorMessage = error?.message || error || 'Failed to add user';
      if (errorMessage.toLowerCase().includes('email already exists')) {
        setClientError('*email already exists');
      } else {
        setClientError('*' + errorMessage.toLowerCase());
      }
      toast.error(errorMessage);
    }
  };

  const handleModalClick = (e) => {
    if (e.target.className.includes("modal fade") && !clientError && !serverError) {
      onHide();
    }
  };

  const handleCloseClick = () => {
    if (!clientError && !serverError) {
      onHide();
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      onClick={handleModalClick}
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-white">
          <div className="modal-header" style={{ borderStyle: "none" }}>
            <h5 className="modal-title" id="addUserModalLabel">
              Add New User
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCloseClick}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Error Alert */}
              {(clientError || serverError) && (
                <div className="alert alert-danger" role="alert">
                  {clientError || '*' + serverError.toLowerCase()}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="text-center mb-0">
                <div className="position-relative d-inline-block">
                  <img
                    src={previewUrl || "https://avatar.iran.liara.run/public/48"}
                    alt="Profile Preview"
                    className="rounded-circle"
                    style={{
                      width: "130px",
                      height: "130px",
                      objectFit: "cover",
                      border: "3px solid #2a2d2e",
                    }}
                  />
                  <label
                    className="btn btn-success btn-sm position-absolute bottom-0 end-0 rounded-circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "2px",
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
                <div>
                    <label className="form-label text-secondary mt-3 mb-0">Select a profile picture</label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="d-flex flex-column gap-4">
                {/* Name Field */}
                <div className="form-group">
                  <label className="form-label text-secondary small">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary">
                      <i className="fas fa-user text-secondary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                      placeholder="Enter full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label text-secondary small">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary">
                      <i className="fas fa-envelope text-secondary"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                      placeholder="Enter email address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* City Field */}
                <div className="form-group">
                  <label className="form-label text-secondary small">
                    City
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary">
                      <i className="fas fa-map-marker-alt text-secondary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                      placeholder="Enter city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Gender Field */}
                <div className="form-group">
                  <label className="form-label text-secondary small">
                    Gender
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary">
                      <i className="fas fa-venus-mars text-secondary"></i>
                    </span>
                    <select
                      className="form-select bg-dark text-white border-secondary rounded-0 rounded-end"
                      name="gender"
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

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label text-secondary small">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary">
                      <i className="fas fa-lock text-secondary"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                      placeholder="Create password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer h-100" style={{ borderStyle: "none" }}>
            <button
              type="button"
              className="btn btn-success w-100 fw-bold"
              style={{
                height: "45px",
                background: 'linear-gradient(45deg, #4cd964, #2ecc71)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.2)',
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding User...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus me-2"></i>
                  Add User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
