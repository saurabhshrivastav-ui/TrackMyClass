const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config();
const Student = require("./models/Student");
const User = require("./models/User");

const userData = [
  {
    userId: "ADMIN-0001",
    name: "Admin",
    phoneNumber: "1111111111",
    rollNumber: null,
    class: null,
    subjects: null,
    role: "admin",
    email: "admin@trackmyclass.edu"
  },
  {
    userId: "STU001",
    name: "Rahul Sharma",
    phoneNumber: "9876501234",
    rollNumber: "STU001",
    class: "FY-IT",
    subjects: null,
    role: "student",
    email: "rahul@college.edu",
    semester: "1st Semester"
  },
  {
    userId: "STU002",
    name: "Priya Verma",
    phoneNumber: "9876505678",
    rollNumber: "STU002",
    class: "SY-IT",
    subjects: null,
    role: "student",
    email: "priya@college.edu",
    semester: "3rd Semester"
  },
  {
    userId: "STU003",
    name: "Amit Kumar",
    phoneNumber: "9876509999",
    rollNumber: "STU003",
    class: "TY-IT",
    subjects: null,
    role: "student",
    email: "amit@college.edu",
    semester: "5th Semester"
  },
  {
    userId: "STU004",
    name: "Neha Singh",
    phoneNumber: "9876512345",
    rollNumber: "STU004",
    class: "FY-IT",
    subjects: null,
    role: "student",
    email: "neha@college.edu",
    semester: "1st Semester"
  },
  {
    userId: "STU005",
    name: "Arjun Mehta",
    phoneNumber: "9876516789",
    rollNumber: "STU005",
    class: "SY-IT",
    subjects: null,
    role: "student",
    email: "arjun@college.edu",
    semester: "3rd Semester"
  },
  {
    userId: "CS2024001",
    name: "Saurabh Shrivastav",
    phoneNumber: "9321656320",
    rollNumber: "STU006",
    class: "TY-IT",
    subjects: null,
    role: "student",
    email: "saurabh@college.edu",
    semester: "6th Semester"
  },
  {
    userId: "T-001",
    name: "Rakesh Gupta",
    phoneNumber: "9812345678",
    rollNumber: null,
    class: "FY-IT",
    subjects: "IT Subjects, Class Teacher FY-IT",
    role: "teacher",
    email: "rakesh.gupta@trackmyclass.edu",
    department: "Information Technology",
    subjectsAssigned: [
      {
        subjectId: "IT-101",
        name: "Programming Fundamentals",
        className: "FY-IT",
        time: "09:00 AM",
        totalStudents: 2,
        students: [
          { studentId: "STU001", name: "Rahul Sharma", rollNumber: "STU001" },
          { studentId: "STU004", name: "Neha Singh", rollNumber: "STU004" }
        ]
      },
      {
        subjectId: "IT-102",
        name: "Digital Electronics",
        className: "FY-IT",
        time: "11:00 AM",
        totalStudents: 2,
        students: [
          { studentId: "STU001", name: "Rahul Sharma", rollNumber: "STU001" },
          { studentId: "STU004", name: "Neha Singh", rollNumber: "STU004" }
        ]
      }
    ]
  },
  {
    userId: "T-002",
    name: "Sunita Sharma",
    phoneNumber: "9823456789",
    rollNumber: null,
    class: "SY-IT",
    subjects: "IT Subjects, Class Teacher SY-IT",
    role: "teacher",
    email: "sunita.sharma@trackmyclass.edu",
    department: "Information Technology",
    subjectsAssigned: [
      {
        subjectId: "IT-201",
        name: "Data Structures",
        className: "SY-IT",
        time: "10:00 AM",
        totalStudents: 2,
        students: [
          { studentId: "STU002", name: "Priya Verma", rollNumber: "STU002" },
          { studentId: "STU005", name: "Arjun Mehta", rollNumber: "STU005" }
        ]
      },
      {
        subjectId: "IT-202",
        name: "Database Management",
        className: "SY-IT",
        time: "01:00 PM",
        totalStudents: 2,
        students: [
          { studentId: "STU002", name: "Priya Verma", rollNumber: "STU002" },
          { studentId: "STU005", name: "Arjun Mehta", rollNumber: "STU005" }
        ]
      }
    ]
  },
  {
    userId: "T-003",
    name: "Anil Verma",
    phoneNumber: "9834567890",
    rollNumber: null,
    class: "TY-IT",
    subjects: "IT Subjects, Class Teacher TY-IT",
    role: "teacher",
    email: "anil.verma@trackmyclass.edu",
    department: "Information Technology",
    subjectsAssigned: [
      {
        subjectId: "IT-301",
        name: "Operating Systems",
        className: "TY-IT",
        time: "09:30 AM",
        totalStudents: 2,
        students: [
          { studentId: "STU003", name: "Amit Kumar", rollNumber: "STU003" },
          { studentId: "CS2024001", name: "Saurabh Shrivastav", rollNumber: "STU006" }
        ]
      },
      {
        subjectId: "IT-302",
        name: "Software Engineering",
        className: "TY-IT",
        time: "02:00 PM",
        totalStudents: 2,
        students: [
          { studentId: "STU003", name: "Amit Kumar", rollNumber: "STU003" },
          { studentId: "CS2024001", name: "Saurabh Shrivastav", rollNumber: "STU006" }
        ]
      }
    ]
  },
  {
    userId: "T-9594",
    name: "Mihitilesh Chauhan",
    phoneNumber: "9594663759",
    rollNumber: null,
    class: "SY-IT",
    subjects: "IT Subjects, Class Teacher SY-IT",
    role: "teacher",
    email: "mihitilesh.chauhan@trackmyclass.edu",
    department: "Information Technology",
    subjectsAssigned: [
      {
        subjectId: "IT-203",
        name: "Web Technologies",
        className: "SY-IT",
        time: "11:30 AM",
        totalStudents: 2,
        students: [
          { studentId: "STU002", name: "Priya Verma", rollNumber: "STU002" },
          { studentId: "STU005", name: "Arjun Mehta", rollNumber: "STU005" }
        ]
      },
      {
        subjectId: "IT-204",
        name: "Computer Networks",
        className: "SY-IT",
        time: "03:00 PM",
        totalStudents: 2,
        students: [
          { studentId: "STU002", name: "Priya Verma", rollNumber: "STU002" },
          { studentId: "STU005", name: "Arjun Mehta", rollNumber: "STU005" }
        ]
      }
    ]
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Seed users
  for (const user of userData) {
    await User.findOneAndUpdate(
      { userId: user.userId },
      { $set: user },
      { upsert: true, new: true }
    );
  }

  // Seed student data for Saurabh
  const subjects = [
    { name: "Data Structures & Algorithms", total: 48, color: "#4CAF50" },
    { name: "Database Management Systems", total: 45, color: "#4CAF50" },
    { name: "Operating Systems", total: 50, color: "#FFA726" },
    { name: "Computer Networks", total: 47, color: "#9C27B0" },
    { name: "Software Engineering", total: 46, color: "#F44336" },
    { name: "Web Technologies", total: 44, color: "#E91E63" },
  ].map((s) => ({
    ...s,
    attended: 0,
    absent: 0,
    percent: 0,
  }));

  await Student.findOneAndUpdate(
    { studentId: "CS2024001" },
    {
      $set: {
        studentId: "CS2024001",
        name: "Saurabh Shrivastav",
        semester: "6th Semester",
        subjects,
      },
    },
    { upsert: true, new: true }
  );

  console.log("Seed complete");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
