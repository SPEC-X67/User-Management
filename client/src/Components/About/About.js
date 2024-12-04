import React from 'react';
import { FaUsers, FaShieldAlt, FaCloudUploadAlt, FaMobileAlt } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaUsers className="fs-1 text-success mb-3" />,
      title: "User Management",
      description: "Complete user lifecycle management with secure authentication and profile handling."
    },
    {
      icon: <FaShieldAlt className="fs-1 text-success mb-3" />,
      title: "Secure System",
      description: "Advanced security measures including JWT authentication and password encryption."
    },
    {
      icon: <FaCloudUploadAlt className="fs-1 text-success mb-3" />,
      title: "Profile Management",
      description: "Easy profile updates with secure image upload and storage capabilities."
    },
    {
      icon: <FaMobileAlt className="fs-1 text-success mb-3" />,
      title: "Responsive Design",
      description: "Fully responsive interface that works seamlessly across all devices."
    }
  ];

  return (
    <div className="bg-dark text-white min-vh-100 py-5">
      <div className="container">

        {/* Technology Stack Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-dark border-secondary">
              <div className="card-body p-4">
                <h3 className="mb-4 text-white">Technology Stack</h3>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="text-success">Frontend</h5>
                    <ul className="list-unstyled text-secondary">
                      <li className="mb-2">• React.js for UI components</li>
                      <li className="mb-2">• Redux Toolkit for state management</li>
                      <li className="mb-2">• Bootstrap for responsive design</li>
                      <li className="mb-2">• Axios for API communication</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-success">Backend</h5>
                    <ul className="list-unstyled text-secondary">
                      <li className="mb-2">• Node.js & Express.js</li>
                      <li className="mb-2">• MongoDB with Mongoose</li>
                      <li className="mb-2">• JWT for authentication</li>
                      <li className="mb-2">• Multer for file uploads</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Features Section */}
        <div className="row">
          <div className="col-12">
            <div className="card bg-dark border-secondary">
              <div className="card-body p-4">
                <h3 className="mb-4 text-white">Key Features</h3>
                <div className="row g-4">
                  <div className="col-md-4">
                    <h5 className="text-success">User Authentication</h5>
                    <p className="text-secondary">
                      Secure login and registration system with JWT token-based authentication
                      and password encryption.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-success">Profile Management</h5>
                    <p className="text-secondary">
                      Complete profile management with image upload capabilities and
                      real-time updates.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-success">Admin Dashboard</h5>
                    <p className="text-secondary">
                      Comprehensive admin panel for user management, monitoring, and
                      system control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;