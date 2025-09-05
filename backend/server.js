const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple JSON file database
const dbFile = path.join(__dirname, 'db.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(dbFile)) {
  const initialData = {
    courses: [
      { id: 1, name: 'Mathematics', instructor: 'Dr. Smith', createdAt: new Date().toISOString() },
      { id: 2, name: 'Computer Science', instructor: 'Prof. Johnson', createdAt: new Date().toISOString() },
      { id: 3, name: 'Physics', instructor: 'Dr. Brown', createdAt: new Date().toISOString() }
    ],
    feedbacks: []
  };
  fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
  console.log('Database file created with initial data');
}

// Helper function to read database
const readDB = () => {
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { courses: [], feedbacks: [] };
  }
};

// Helper function to write to database
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

// Validation functions
const validateCourse = (name, instructor) => {
  const errors = [];
  if (!name || name.trim() === '') errors.push('Course name is required');
  if (!instructor || instructor.trim() === '') errors.push('Instructor name is required');
  return errors;
};

const validateFeedback = (courseId, rating) => {
  const errors = [];
  if (!courseId || isNaN(courseId)) errors.push('Valid course ID is required');
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) errors.push('Rating must be between 1 and 5');
  return errors;
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Get all courses with average ratings
app.get('/api/courses', (req, res) => {
  try {
    const db = readDB();
    
    const coursesWithRatings = db.courses.map(course => {
      const courseFeedbacks = db.feedbacks.filter(f => f.courseId === course.id);
      const avgRating = courseFeedbacks.length > 0 
        ? (courseFeedbacks.reduce((sum, f) => sum + f.rating, 0) / courseFeedbacks.length).toFixed(1)
        : 0;

      return {
        ...course,
        avgRating: parseFloat(avgRating),
        feedbackCount: courseFeedbacks.length
      };
    });

    res.json({
      success: true,
      data: coursesWithRatings,
      count: coursesWithRatings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses'
    });
  }
});

// Create a new course
app.post('/api/courses', (req, res) => {
  try {
    const { name, instructor } = req.body;
    
    // Validate input
    const errors = validateCourse(name, instructor);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }

    const db = readDB();
    
    // Create new course
    const newCourse = {
      id: Math.max(...db.courses.map(c => c.id), 0) + 1,
      name: name.trim(),
      instructor: instructor.trim(),
      createdAt: new Date().toISOString()
    };

    db.courses.push(newCourse);
    
    if (writeDB(db)) {
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: newCourse
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create course'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Submit feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    
    // Validate input
    const errors = validateFeedback(courseId, rating);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }

    const db = readDB();
    
    // Check if course exists
    const courseExists = db.courses.some(course => course.id === parseInt(courseId));
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Create new feedback
    const newFeedback = {
      id: Math.max(...db.feedbacks.map(f => f.id), 0) + 1,
      courseId: parseInt(courseId),
      rating: parseInt(rating),
      comment: comment ? comment.trim() : '',
      createdAt: new Date().toISOString()
    };

    db.feedbacks.push(newFeedback);
    
    if (writeDB(db)) {
      res.json({
        success: true,
        message: 'Feedback submitted successfully!',
        data: newFeedback
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save feedback'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Add these routes before the error handling middleware

// Update a course
app.put('/api/courses/:courseId', (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const { name, instructor } = req.body;
    
    // Validate input
    const errors = validateCourse(name, instructor);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }

    const db = readDB();
    const courseIndex = db.courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Update course
    db.courses[courseIndex] = {
      ...db.courses[courseIndex],
      name: name.trim(),
      instructor: instructor.trim()
    };

    if (writeDB(db)) {
      res.json({
        success: true,
        message: 'Course updated successfully',
        data: db.courses[courseIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update course'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Delete a course
app.delete('/api/courses/:courseId', (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const db = readDB();
    
    const courseIndex = db.courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Remove associated feedback
    db.feedbacks = db.feedbacks.filter(f => f.courseId !== courseId);
    
    // Remove course
    db.courses.splice(courseIndex, 1);

    if (writeDB(db)) {
      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete course'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Get analytics for a course
app.get('/api/analytics/:courseId', (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const db = readDB();
    
    const courseFeedbacks = db.feedbacks.filter(f => f.courseId === courseId);
    
    if (courseFeedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No feedback found for this course'
      });
    }

    // Calculate average rating
    const totalRating = courseFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = (totalRating / courseFeedbacks.length).toFixed(1);

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    courseFeedbacks.forEach(feedback => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        ratingDistribution[feedback.rating - 1]++;
      }
    });

    res.json({
      success: true,
      data: {
        courseId,
        averageRating: parseFloat(averageRating),
        totalFeedbacks: courseFeedbacks.length,
        ratingDistribution,
        courseFeedbacks: courseFeedbacks.slice(-5) // Last 5 feedbacks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Get course details with feedback
app.get('/api/courses/:courseId', (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const db = readDB();
    
    const course = db.courses.find(c => c.id === courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const courseFeedbacks = db.feedbacks.filter(f => f.courseId === courseId);
    const totalRating = courseFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = courseFeedbacks.length > 0 
      ? (totalRating / courseFeedbacks.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        ...course,
        avgRating: parseFloat(averageRating),
        feedbackCount: courseFeedbacks.length,
        feedbacks: courseFeedbacks.slice(-10), // Last 10 feedbacks
        analytics: courseFeedbacks.length > 0 ? {
          averageRating: parseFloat(averageRating),
          totalFeedbacks: courseFeedbacks.length,
          ratingDistribution: [0, 0, 0, 0, 0].map((_, i) => 
            courseFeedbacks.filter(f => f.rating === i + 1).length
          )
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course details'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Enhanced Backend server is running!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`=================================`);
  console.log('Available endpoints:');
  console.log(`GET  http://localhost:${PORT}/api/health`);
  console.log(`GET  http://localhost:${PORT}/api/courses`);
  console.log(`POST http://localhost:${PORT}/api/courses`);
  console.log(`POST http://localhost:${PORT}/api/feedback`);
  console.log(`GET  http://localhost:${PORT}/api/analytics/:courseId`);
  console.log(`GET  http://localhost:${PORT}/api/courses/:courseId`);
  console.log(`=================================`);
});