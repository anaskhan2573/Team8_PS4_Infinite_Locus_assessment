const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');

const dbFile = path.join(__dirname, '../db.json');

class DatabaseService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!fs.existsSync(dbFile)) {
      const initialData = {
        courses: [
          new Course(1, 'Mathematics', 'Dr. Smith'),
          new Course(2, 'Computer Science', 'Prof. Johnson'),
          new Course(3, 'Physics', 'Dr. Brown')
        ],
        feedbacks: []
      };
      this.writeDB(initialData);
    }
  }

  readDB() {
    try {
      const data = fs.readFileSync(dbFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return { courses: [], feedbacks: [] };
    }
  }

  writeDB(data) {
    try {
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing to database:', error);
      return false;
    }
  }

  // Course methods
  getAllCourses() {
    const db = this.readDB();
    return db.courses;
  }

  getCourseById(id) {
    const db = this.readDB();
    return db.courses.find(course => course.id === id);
  }

  createCourse(name, instructor) {
    const db = this.readDB();
    const newCourse = new Course(
      Math.max(...db.courses.map(c => c.id), 0) + 1,
      name,
      instructor
    );
    db.courses.push(newCourse);
    return this.writeDB(db) ? newCourse : null;
  }

  // Feedback methods
  getAllFeedback() {
    const db = this.readDB();
    return db.feedbacks;
  }

  getFeedbackByCourseId(courseId) {
    const db = this.readDB();
    return db.feedbacks.filter(feedback => feedback.courseId === courseId);
  }

  createFeedback(courseId, rating, comment) {
    const db = this.readDB();
    
    // Verify course exists
    const courseExists = db.courses.some(course => course.id === courseId);
    if (!courseExists) {
      return { error: 'Course not found' };
    }

    const newFeedback = new Feedback(
      Math.max(...db.feedbacks.map(f => f.id), 0) + 1,
      courseId,
      rating,
      comment
    );

    db.feedbacks.push(newFeedback);
    return this.writeDB(db) ? newFeedback : { error: 'Failed to save feedback' };
  }

  // Analytics methods
  getCourseAnalytics(courseId) {
    const courseFeedbacks = this.getFeedbackByCourseId(courseId);
    
    if (courseFeedbacks.length === 0) {
      return { error: 'No feedback found for this course' };
    }

    const totalRating = courseFeedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = (totalRating / courseFeedbacks.length).toFixed(1);

    const ratingDistribution = [0, 0, 0, 0, 0];
    courseFeedbacks.forEach(feedback => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        ratingDistribution[feedback.rating - 1]++;
      }
    });

    return {
      courseId,
      averageRating: parseFloat(averageRating),
      totalFeedbacks: courseFeedbacks.length,
      ratingDistribution,
      courseFeedbacks: courseFeedbacks.slice(-5) // Last 5 feedbacks
    };
  }
}

module.exports = new DatabaseService();