import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../redux/reducers/admin/adminSlice';
import AddUser from '../../pages/admin/Adduser';
import EditUser from '../../pages/admin/Edituser';
import toast from 'react-hot-toast'; // Import toast

const Dashboard = () => {

  const navigate= useNavigate();
  const dispatch = useDispatch();
  const { users, loading, isAuthenticated} = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/admin');
      return
    }
    dispatch(getAllUsers());
  },[isAuthenticated, navigate, dispatch]);

  const filteredUsers = users?.filter(user => 
    (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.gender?.toLowerCase() === searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    toast((t) => (
      <div className="confirm-toast-container">
        <div className="confirm-toast-content">
          <div className="confirm-toast-icon">
            <i className="fas fa-exclamation-triangle text-warning"></i>
          </div>
          <div className="confirm-toast-message">
            <h6 className="mb-1 text-white">Confirm Deletion</h6>
            <p className="mb-0 text-light">Are you sure you want to delete this user?</p>
          </div>
          <div className="confirm-toast-actions">
            <button 
              className="toast-cancel-btn"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button 
              className="toast-delete-btn"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const result = await dispatch(deleteUser(userId)).unwrap();
                  if (result && result.message) {
                    toast.success(result.message);
                  }
                } catch (error) {
                  const errorMessage = error?.message || error || 'Failed to delete user';
                  toast.error(errorMessage);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        background: 'transparent',
        padding: 0,
        boxShadow: 'none'
      },
    });
  };

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
    <>
    <div className="container py-4 mt-5">
      <div className="card bg-dark border-0">
        <div className="card-header bg-dark border-0 d-flex justify-content-between align-items-center py-4">
          <div>
            <h2 className="h4 mb-1 text-white">User Control Panel</h2>
            <p className="text-secondary small mb-0">Handle Accounts with Ease.</p>
          </div>
          <button 
          className="btn btn-success d-flex align-items-center gap-2" 
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(45deg, #4cd964, #2ecc71)',
            border: 'none',
            boxShadow: '0 1px 15px rgba(46, 204, 113, 0.1)',
          }}
          >
            <i className="fas fa-plus"></i>
            New User
          </button>
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
                      <button 
                       className="btn btn-icon btn-action"
                       style={{
                          border: '1px solid #4cd964'
                        }}
                       onClick={() => {
                        setShowEditModal(true) 
                        setSelectedUser(user)}}
                       >
                        <i className="fas fa-edit text-success"></i>
                      </button>
                      <button 
                      className="btn btn-icon btn-action" 
                      style={{ 
                        border: '1px solid #ff4d4f'
                        }}
                        onClick={() => handleDeleteUser(user._id)}
                        >
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
    <AddUser show={showAddModal} onHide={() => setShowAddModal(false)}/>
    <EditUser show={showEditModal} onHide={() => {
      setShowEditModal(false);
      setSelectedUser(null)}}
      userData={selectedUser}/>
    </>
    );
};

export default Dashboard;