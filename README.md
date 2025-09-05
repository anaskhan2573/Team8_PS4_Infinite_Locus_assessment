# Team8_PS4_Infinite_Locus_assessment
**🎓 Student Feedback System**

A comprehensive web application for collecting and analyzing student feedback for courses. This system allows students to submit ratings and comments, while providing instructors with detailed analytics on course performance.

**🚀 Features**

Course Management: Full CRUD operations for courses

Feedback Submission: Students can rate courses (1-5 stars) and add comments

Analytics Dashboard: Visual charts showing rating distribution and average ratings

Responsive Design: Works on desktop and mobile devices

Real-time Updates: Instant feedback aggregation and display
**
🛠️ Technology Stack**

**Frontend:**

React.js with Hooks

React Router for navigation

Bootstrap for styling

Chart.js for analytics visualization

**Backend:**

JSON Server (mock API)

RESTful API design

Database:

JSON-based data storage

Relationships between courses and feedback

**📁 Project Structure**
**feedback-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── courseController.js
│   │   └── feedbackController.js
│   ├── models/
│   │   ├── index.js
│   │   ├── course.js
│   │   └── feedback.js
│   ├── routes/
│   │   ├── courses.js
│   │   └── feedback.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CourseList.js
│   │   │   ├── FeedbackForm.js
│   │   │   └── Analytics.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── index.html
└── README.md**
**
**👥 Team Members****
Name	Role
Anas Khan (60205220203)	Team Lead and Backend Developer

Bharat Singh Parmar (A20405222117)	Backend Developer

Vivek Sharma (A60205222286)	Frontend Developer

Harsh Dhama (20405222195)	UI/UX Designer

🎯 Assessment Requirements Met

Backend:
✅ CRUD operations for courses
✅ API to submit feedback
✅ API to return aggregated rating stats

Frontend:
✅ Course list with average ratings
✅ Feedback form with rating system
✅ Analytics page with charts (bar/pie)

Database:
✅ Courses table with course information
✅ Feedback table with student ratings and comments
✅ Proper relationships between tables

**🚦 Getting Started**
Prerequisites

Node.js (v14 or higher)

npm or yarn

Installation
# Clone the repository
git clone <repository-url>
cd student-feedback-system

# Install dependencies
npm install

# Start JSON server (backend)
npm run server

# Start React application
npm start


Open your browser and navigate to http://localhost:3000

📊 API Endpoints

Courses

GET /courses - Get all courses

GET /courses/:id - Get a specific course

POST /courses - Create a new course

PUT /courses/:id - Update a course

DELETE /courses/:id - Delete a course

Feedback

GET /feedbacks - Get all feedback entries

POST /feedbacks - Submit new feedback

GET /feedbacks?courseId=:id - Get feedback for a specific course

🎨 Usage

For Students

Browse available courses on the home page

Click "Give Feedback" to rate a course

Select a rating (1-5 stars) and optionally add comments

Submit your feedback

For Instructors/Admins

Navigate to "Course Management" to add, edit, or delete courses

View "Analytics" to see detailed rating distributions

Monitor course performance through visual charts

📱 Screenshots

Home Page: List of all available courses with average ratings

Feedback Form: Simple form for submitting course evaluations

Analytics Dashboard: Visual representation of rating distributions

Course Management: Interface for managing course catalog

🔮 Future Enhancements

User authentication and authorization

Email notifications for new feedback

Export analytics data to CSV/PDF

Advanced filtering and search capabilities

Integration with learning management systems

📄 License

This project was developed as part of the Infinite Locus Assessment Program.

📞 Contact
Name	      Email
Anas Khan	Khananas2573@gmail.com

Bharat Singh Parmar	parmarbharatsingh77@gmail.com

Vivek Sharma	sharmaviv1122@gmail.com
<img width="1917" height="987" alt="image" src="https://github.com/user-attachments/assets/37731b68-58e2-4e4e-816f-68b79f370c70" />
<img width="1919" height="1074" alt="image" src="https://github.com/user-attachments/assets/37c6d67f-e97b-43fd-9603-f28dc187a431" />
![WhatsApp Image 2025-09-05 at 12 08 28_9638d6d6](https://github.com/user-attachments/assets/83d7a7d9-955d-48bd-891d-cac721d61cbc)
![WhatsApp Image 2025-09-05 at 12 08 39_1ab9e34e](https://github.com/user-attachments/assets/a710d5b6-f72f-4901-8544-0ce7b949cf75)



