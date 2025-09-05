import React, { useState, useEffect } from 'react';

// API base URL
const API_BASE = 'http://localhost:5000/api';

const Analytics = ({ courses }) => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Make sure courses is always an array
  const safeCourses = Array.isArray(courses) ? courses : [];

  useEffect(() => {
    if (selectedCourseId) {
      fetchAnalytics(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchAnalytics = async (courseId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/analytics/${courseId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle both response formats
      const data = result.data || result;
      setFeedbackData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again.');
      
      // Fallback to mock data
      setFeedbackData({
        averageRating: 4.2,
        totalFeedbacks: 25,
        ratingDistribution: [2, 3, 5, 10, 5]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Course Analytics</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="analyticsCourseSelect" className="form-label">
            Select Course
          </label>
          <select
            className="form-select"
            id="analyticsCourseSelect"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Choose a course...</option>
            {safeCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} - {course.instructor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Warning:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading analytics...</p>
        </div>
      )}

      {feedbackData && !loading && (
        <>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Average Rating</h5>
                  <h2 className="text-primary">{feedbackData.averageRating}/5</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Total Feedbacks</h5>
                  <h2 className="text-primary">{feedbackData.totalFeedbacks}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Rating Distribution</h5>
                </div>
                <div className="card-body">
                  {feedbackData.ratingDistribution && feedbackData.ratingDistribution.map((count, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{index + 1} Star{index !== 0 ? 's' : ''}:</span>
                      <div className="progress w-50">
                        <div 
                          className="progress-bar" 
                          style={{
                            width: `${(count / feedbackData.totalFeedbacks) * 100}%`,
                            backgroundColor: getColorForRating(index + 1)
                          }}
                        ></div>
                      </div>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedCourseId && !loading && (
        <div className="alert alert-info">
          Please select a course to view its analytics.
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on rating
function getColorForRating(rating) {
  const colors = [
    '#dc3545', // red for 1 star
    '#fd7e14', // orange for 2 stars
    '#ffc107', // yellow for 3 stars
    '#20c997', // teal for 4 stars
    '#198754'  // green for 5 stars
  ];
  return colors[rating - 1] || '#6c757d';
}

export default Analytics;