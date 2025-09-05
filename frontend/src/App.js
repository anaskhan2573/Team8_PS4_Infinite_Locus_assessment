import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import CourseList from './components/CourseList';
import FeedbackForm from './components/FeedbackForm';
import Analytics from './components/Analytics';
import CourseManagement from './components/CourseManagement';

function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // For now, using mock data - we'll add API later
      const mockCourses = [
        { id: 1, name: 'Mathematics', instructor: 'Dr. Smith', avgRating: 4.2, feedbackCount: 15 },
        { id: 2, name: 'Computer Science', instructor: 'Prof. Johnson', avgRating: 4.5, feedbackCount: 22 },
        { id: 3, name: 'Physics', instructor: 'Dr. Brown', avgRating: 3.8, feedbackCount: 8 },
        { id: 4, name: 'Chemistry', instructor: 'Dr. Wilson', avgRating: 4.1, feedbackCount: 12 },
        { id: 5, name: 'Biology', instructor: 'Dr. Davis', avgRating: 4.3, feedbackCount: 18 }
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route 
              path="/" 
              element={
                <CourseList 
                  courses={courses} 
                  setSelectedCourse={setSelectedCourse} 
                />
              } 
            />
            <Route 
              path="/feedback" 
              element={
                <FeedbackForm 
                  course={selectedCourse} 
                  courses={courses} 
                />
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <Analytics 
                  courses={courses} 
                />
              } 
            />
            <Route 
              path="/manage-courses" 
              element={
                <CourseManagement 
                  courses={courses} 
                  onCourseUpdate={fetchCourses}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;