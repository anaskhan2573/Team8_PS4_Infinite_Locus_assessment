import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Student Feedback System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/feedback">
                Give Feedback
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/analytics">
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage-courses">
                Manage Courses
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;