import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../redux/reducers/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger mt-5" role="alert">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dark-theme">
      <div className="container py-5">
        <div className="card main-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-white mb-1">User Management</h2>
                <p className="text-muted small">Manage your users in seconds</p>
              </div>
              <Link to="/register" className="btn btn-success">
                <i className="fas fa-plus me-2"></i>
                Add User
              </Link>
            </div>
            
            <div className="table-responsive">
              <table className="table table-dark table-hover custom-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <img 
                          src={`http://localhost:5000/uploads/${user.profile}`}
                          alt={user.name}
                          className="rounded-circle"
                          width="40"
                          height="40"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.gender}</td>
                      <td>{user.city}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-outline-info btn-sm">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-outline-danger btn-sm ms-2">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;