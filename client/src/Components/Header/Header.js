import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducers/user/userSlice';
import { logout as adminLogout } from '../../redux/reducers/admin/adminSlice';
import toast from 'react-hot-toast';

const Header = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isAdmin) {
      dispatch(adminLogout());
      navigate('/admin');
      toast.success('See you soon!');
    } else {
      dispatch(logout());
      navigate('/');
      toast.success('See you soon!');
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid" style={{height: "50px"}}>
        <Link to="/about" className="navbar-brand fw-bold fs-4 mx-2" >WoiTap</Link>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Header;
