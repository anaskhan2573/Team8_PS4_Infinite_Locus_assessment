import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseList = ({ courses, setSelectedCourse }) => {
  const navigate = useNavigate();

  const handleFeedbackClick = (course) => {
    setSelectedCourse(course);
    navigate('/feedback');
  };

  const handleAnalyticsClick = (course) => {
    setSelectedCourse(course);
    navigate('/analytics');
  };

  return (
    <div>
      <h2 className="mb-4">Available Courses</h2>
      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  Instructor: {course.instructor}
                </h6>
                {/* Changed from <p> to <div> to fix the warning */}
                <div className="card-text">
                  Average Rating: {course.avgRating}/5
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleFeedbackClick(course)}
                >
                  Give Feedback
                </button>
                <button
                  className="btn btn-info btn-sm text-white"
                  onClick={() => handleAnalyticsClick(course)}
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;