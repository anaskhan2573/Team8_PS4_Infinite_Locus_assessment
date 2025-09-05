import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API base URL
const API_BASE = 'http://localhost:5000/api';

const FeedbackForm = ({ course, courses, onFeedbackSubmit }) => {
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState(course?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourseId) {
      setError('Please select a course');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          rating,
          comment
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }
      
      alert('Feedback submitted successfully!');
      setSelectedCourseId('');
      setRating(5);
      setComment('');
      
      // Refresh courses to update ratings
      if (onFeedbackSubmit) {
        onFeedbackSubmit();
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h2 className="mb-4">Submit Feedback</h2>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="courseSelect" className="form-label">
              Select Course
            </label>
            <select
              className="form-select"
              id="courseSelect"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.instructor}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`btn btn-rating me-1 ${rating >= star ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setRating(star)}
                >
                  {star} ⭐
                </button>
              ))}
            </div>
            <small className="text-muted">Selected: {rating} stars</small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Comments (optional)
            </label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;