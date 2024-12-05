import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/reducers/user/userSlice";
import toast from 'react-hot-toast';

const EditProfile = ({ show, onHide, userData }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Optional for edit
    gender: "",
    city: "",
    profile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("User Data:", userData._id);
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        gender: userData.gender || "",
        city: userData.city || "",
        profile: null,
      });
      setPreviewUrl(userData.profile ? `http://localhost:5000/uploads/${userData.profile}` : null);
    }
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form (password is optional for edit)
    if (!formData.name.trim() || !formData.email.trim() || !formData.gender.trim() || !formData.city.trim()) {
      setError("Name, email, gender, and city are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('*please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password if it's being changed
    if (formData.password && formData.password.length < 6) {
      setError('*password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Create FormData object
      const data = new FormData();

      // Only append fields that are not empty
      Object.keys(formData).forEach((key) => {
        if (key === 'password' && !formData[key]) return; // Skip empty password
        if (key === 'profile' && !formData[key]) return; // Skip if no new profile image
        data.append(key, formData[key]);
      });

      // Dispatch updateUser action with user ID
      const result = await dispatch(updateUserProfile({
        id: userData._id,
        data
      })).unwrap();

      toast.success('Profile updated successfully');
      onHide();
    } catch (err) {
      // Get error message from rejected action
      const errorMessage = err.message || err || "Failed to update user";
      setError('*' + errorMessage.toLowerCase());
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      id="editUserModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="editUserModalLabel"
      style={{ display: show ? "block" : "none" }}
      onClick={(e) => {
        if (e.target.className.includes("modal fade show")) {
          onHide();
        }
      }}
      aria-hidden={!show}
    >
      <div
        className="modal-dialog modal-dialog-scrollable modal-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-white">
          {/* Modal Header */}
          <div className="modal-header" style={{ borderStyle: "none" }}>
            <h5 className="modal-title" id="editUserModalLabel">
              Edit User
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={previewUrl || `http://localhost:5000/uploads/${userData?.profile}` || "https://avatar.iran.liara.run/public/48"}
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
                    />
                  </label>
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Password Field (Optional) */}
                <div className="form-group">
                  <label className="form-label text-secondary small">
                    Password (Leave blank to keep unchanged)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary">
                      <i className="fas fa-lock text-secondary"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control bg-dark text-white border-secondary rounded-0 rounded-end"
                      placeholder="Create new password (optional)"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                  Updating Profile...
                </>
              ) : (
                <>
                  <i className="fas fa-edit me-2"></i>
                  Update Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
