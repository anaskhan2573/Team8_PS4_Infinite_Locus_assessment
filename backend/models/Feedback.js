class Feedback {
  constructor(id, courseId, rating, comment = '') {
    this.id = id;
    this.courseId = courseId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = new Date().toISOString();
  }

  // Validation rules
  static validationRules() {
    return {
      courseId: {
        isInt: { min: 1 },
        errorMessage: "Valid course ID is required"
      },
      rating: {
        isInt: { min: 1, max: 5 },
        errorMessage: "Rating must be between 1 and 5"
      },
      comment: {
        optional: true,
        isLength: { max: 500 },
        errorMessage: "Comment cannot exceed 500 characters"
      }
    };
  }
}

module.exports = Feedback;