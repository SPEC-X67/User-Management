import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../redux/reducers/admin/adminSlice';

const Dashboard = () => {

  const navigate= useNavigate();
  const dispatch = useDispatch();
  const { users, loading, isAuthenticated} = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/admin');
    }
  },[isAuthenticated, navigate])

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filteredUsers = users?.filter(user => 
    (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.gender?.toLowerCase() === searchTerm.toLowerCase())
  );

  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return 'https://via.placeholder.com/40';
    return `http://localhost:5000/uploads/${profileImage}`;
  };

  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 mt-5">
      <div className="card bg-dark border-0">
        <div className="card-header bg-dark border-0 d-flex justify-content-between align-items-center py-4">
          <div>
            <h2 className="h4 mb-1 text-white">User Management</h2>
            <p className="text-secondary small mb-0">Manage users in seconds</p>
          </div>
          <Link to="/admin/adduser" className="btn btn-success d-flex align-items-center gap-2">
            <i className="fas fa-plus"></i>
            New User
          </Link>
        </div>

        <div className="px-4 pb-3">
          <div className="input-group" style={{ maxWidth: '320px'}}>
            <input
              type="text"
              className="form-control form-control-sm bg-dark border-secondary text-white"
              style={{ maxHeight: '45px'}}
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th className="ps-4">PROFILE</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>GENDER</th>
                <th>CITY</th>
                <th className="text-end pe-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="ps-4">
                    <img
                      src={getProfileImageUrl(user.profile)}
                      alt={user.name}
                      className="profile-image"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.city}</td>
                  <td className="text-end pe-4">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-icon btn-action" style={{ border: '1px solid #4cd964'}}>
                        <i className="fas fa-edit text-success"></i>
                      </button>
                      <button className="btn btn-icon btn-action" style={{ border: '1px solid #ff4d4f'}}>
                        <i className="fas fa-trash text-danger"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!filteredUsers || filteredUsers.length === 0) && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;