import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    city: 'New York',
    gender: 'Male',
    profile: null
  });

  useEffect(() => {
    // TODO: Fetch user data from backend
  }, []);

  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return 'https://via.placeholder.com/150';
    return `http://localhost:5000/public/uploads/${profileImage}`;
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Profile Card */}
        <div className="col-lg-4 mb-4">
          <div className="card bg-dark text-white">
            <div className="card-body text-center p-4">
              <div className="mb-4">
                <img
                  src={getProfileImageUrl(user.profile)}
                  alt={user.name}
                  className="rounded-circle"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '4px solid #2a2d2e'
                  }}
                />
              </div>
              <h3 className="fw-bold mb-1">{user.name}</h3>
              <p className="text-secondary mb-3">{user.email}</p>
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
              <button className="btn btn-outline-light w-100">
                <i className="fas fa-edit me-2"></i>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="col-lg-8">
          <div className="card bg-dark text-white mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Quick Actions</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card bg-success bg-opacity-10 border-success h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-success p-3 me-3">
                          <i className="fas fa-tasks text-dark fs-4"></i>
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>My Tasks</h5>
                      </div>
                      <p className="text-secondary mb-0">View and manage your assigned tasks</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-success bg-opacity-10 border-success h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-success p-3 me-3">
                          <i className="fas fa-calendar-alt text-dark fs-4"></i>
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>Schedule</h5>
                      </div>
                      <p className="text-secondary mb-0">Check your upcoming events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-dark text-white">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Recent Activity</h4>
              <div className="list-group list-group-flush">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="list-group-item bg-dark text-white border-secondary px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                        <i className="fas fa-check text-success"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Task Completed</h6>
                        <p className="text-secondary small mb-0">You completed the project documentation</p>
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
    </div>
  );
};

export default Home;
