import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditProfile from '../../pages/user/EditProfile';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/users/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to load user data');
        setLoading(false);

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchUserData();
  }, [navigate, showEditModal]);

  // Helper to get profile image URL
  const getProfileImageUrl = (profileImage) =>
    profileImage
      ? `http://localhost:5000/uploads/${profileImage}`
      : 'https://avatar.iran.liara.run/public/48';

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-dark">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-dark">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="container py-5">
        <div className="row">
          {/* Profile Card */}
          <div className="col-lg-4 mb-4">
            <div className="card bg-dark text-white">
              <div className="card-body text-center p-4">
                <img
                  src={getProfileImageUrl(user.profile)}
                  alt={user.name}
                  className="rounded-circle mb-4"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '4px solid #2a2d2e',
                  }}
                />
                <h3 className="fw-bold">{user.name}</h3>
                <p className="text-secondary">{user.email}</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <span className="badge bg-success px-3 py-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {user.city}
                  </span>
                  <span className="badge bg-success px-3 py-2">
                    <i className="fas fa-user me-2"></i>
                    {user.gender}
                  </span>
                </div>
                <button className="btn btn-outline-light w-100" onClick={() => setShowEditModal(true)}>
                  <i className="fas fa-edit me-2"></i>Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Actions and Recent Activity */}
          <div className="col-lg-8">
            <div className="card bg-dark text-white mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Quick Actions</h4>
                <div className="row g-3">
                  {[
                    { title: 'My Tasks', icon: 'fas fa-tasks', text: 'View and manage your assigned tasks' },
                    { title: 'Schedule', icon: 'fas fa-calendar-alt', text: 'Check your upcoming events' },
                  ].map((action, index) => (
                    <div className="col-md-6" key={index}>
                      <div className="card bg-success bg-opacity-10 border-success h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="rounded-circle bg-success p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className={`${action.icon} text-dark fs-4`}></i>
                            </div>
                            <h5 className="fw-bold text-white mb-0">{action.title}</h5>
                          </div>
                          <p className="text-secondary mb-0">{action.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card bg-dark text-white">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Recent Activity</h4>
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="list-group-item bg-dark text-white border-secondary px-0 py-3"
                  >
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-success bg-opacity-10 me-3" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-check text-success"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Task Completed</h6>
                        <p className="text-secondary small mb-0">
                          You completed the project documentation
                        </p>
                      </div>
                      <small className="text-secondary ms-auto">2h ago</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfile show={showEditModal} onHide={() => setShowEditModal(false)} userData={user} />
    </>
  );
};

export default Home;
