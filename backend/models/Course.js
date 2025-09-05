class Course {
  constructor(id, name, instructor) {
    this.id = id;
    this.name = name;
    this.instructor = instructor;
    this.createdAt = new Date().toISOString();
  }

  // Validation rules
  static validationRules() {
    return {
      name: {
        notEmpty: true,
        errorMessage: "Course name is required"
      },
      instructor: {
        notEmpty: true,
        errorMessage: "Instructor name is required"
      }
    };
  }
}

module.exports = Course;