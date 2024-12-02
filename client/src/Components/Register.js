import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h2>New User Registration</h2>
                    <p className="subtitle">Create a new user account</p>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label d-block">Gender</label>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="male"
                                    name="gender"
                                    value="male"
                                />
                                <label className="form-check-label" htmlFor="male">Male</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="female"
                                    name="gender"
                                    value="female"
                                />
                                <label className="form-check-label" htmlFor="female">Female</label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                placeholder="Enter your city"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="profile" className="form-label">Profile Photo</label>
                            <input
                                type="file"
                                className="form-control"
                                id="profile"
                                accept="image/*"
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <Link to="/" className="btn btn-secondary">
                                <i className="fas fa-arrow-left me-2"></i>Back
                            </Link>
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;