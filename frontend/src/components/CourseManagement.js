import React, { useState, useEffect } from 'react';

const CourseManagement = ({ courses = [], onCourseUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ name: '', instructor: '' });
  const [localCourses, setLocalCourses] = useState([]);

  // Add dummy courses initially
  useEffect(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      setLocalCourses(courses);
    } else {
      setLocalCourses([
        { id: 1, name: 'React Basics', instructor: 'John Doe', avgRating: 4.5, feedbackCount: 10 },
        { id: 2, name: 'Node.js Fundamentals', instructor: 'Jane Smith', avgRating: 4.0, feedbackCount: 8 },
        { id: 3, name: 'Python for ML', instructor: 'Alice Johnson', avgRating: 3.8, feedbackCount: 12 }
      ]);
    }
  }, [courses]);

  // Reset form when switching between add and edit modes
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name || '',
        instructor: editingCourse.instructor || ''
      });
    } else {
      setFormData({ name: '', instructor: '' });
    }
  }, [editingCourse]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.instructor) return;

    if (editingCourse) {
      const updatedCourses = localCourses.map(course =>
        course.id === editingCourse.id
          ? { ...course, name: formData.name, instructor: formData.instructor }
          : course
      );
      setLocalCourses(updatedCourses);
      onCourseUpdate && onCourseUpdate(updatedCourses);
      alert('Course updated successfully!');
    } else {
      const maxId = localCourses.length > 0 ? Math.max(...localCourses.map(c => c.id)) : 0;
      const newCourse = {
        id: maxId + 1,
        name: formData.name,
        instructor: formData.instructor,
        avgRating: 0,
        feedbackCount: 0
      };
      const updatedCourses = [...localCourses, newCourse];
      setLocalCourses(updatedCourses);
      onCourseUpdate && onCourseUpdate(updatedCourses);
      alert('Course created successfully!');
    }

    setFormData({ name: '', instructor: '' });
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = localCourses.filter(course => course.id !== courseId);
      setLocalCourses(updatedCourses);
      onCourseUpdate && onCourseUpdate(updatedCourses);
      alert('Course deleted successfully!');
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({ name: '', instructor: '' });
  };

  const formatDisplayValue = (value) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100 * 5).toFixed(1);
    }
    return value;
  };

  return (
    <div className="course-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📚 Course Management</h2>
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => { setEditingCourse(null); setShowForm(!showForm); }}
        >
          {showForm && !editingCourse ? '✖ Cancel' : '➕ Add New Course'}
        </button>
      </div>

      {(showForm || editingCourse) && (
        <div className="card shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">{editingCourse ? 'Edit Course' : 'Add New Course'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Course Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter course name"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Instructor</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    placeholder="Enter instructor name"
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success btn-lg">
                  {editingCourse ? '💾 Update Course' : '💾 Create Course'}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-lg">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">📋 Existing Courses ({localCourses.length})</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Rating</th>
                  <th>Feedbacks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localCourses.map(course => {
                  const displayRating = formatDisplayValue(course.avgRating);
                  const displayFeedback = formatDisplayValue(course.feedbackCount);
                  return (
                    <tr key={course.id}>
                      <td><strong>#{course.id}</strong></td>
                      <td>{course.name}</td>
                      <td>{course.instructor}</td>
                      <td>
                        <span className={`badge ${displayRating >= 4 ? 'bg-success' : displayRating >= 3 ? 'bg-warning' : 'bg-danger'}`}>
                          ⭐ {displayRating}/5
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary">📝 {displayFeedback}</span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => handleEdit(course)}>✏️ Edit</button>
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(course.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {localCourses.length === 0 && (
            <div className="text-center py-4 text-muted">
              <h4>📭 No courses found</h4>
              <p>Click "Add New Course" to create your first course!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
