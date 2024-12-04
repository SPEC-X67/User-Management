import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/reducers/admin/adminSlice";

const AddUser = ({ show, onHide }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    city: "",
    profile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();

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
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.gender ||
      !formData.city
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Create FormData object
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      // Dispatch addUser action
      await dispatch(addUser(data)).unwrap();
      onHide();
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        gender: "",
        city: "",
        profile: null,
      });
      setPreviewUrl(null);
    } catch (error) {
      setError(error.message || "Failed to register user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      id="addUserModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="addUserModalLabel"
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
            <h5 className="modal-title" id="addUserModalLabel">
              Add New User
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
                    src={previewUrl || "https://via.placeholder.com/150"}
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
              style={{ height: "45px" }}
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
