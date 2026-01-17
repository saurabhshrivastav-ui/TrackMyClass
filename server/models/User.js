const mongoose = require("mongoose");

const StudentRefSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    rollNumber: { type: String, default: "" },
  },
  { _id: false }
);

const SubjectAssignmentSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true },
    name: { type: String, required: true },
    className: { type: String, default: "" },
    time: { type: String, default: "" },
    totalStudents: { type: Number, default: 0 },
    students: { type: [StudentRefSchema], default: [] },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    role: { type: String, enum: ["admin", "teacher", "student"], required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    rollNumber: { type: String, default: null },
    class: { type: String, default: null },
    subjects: { type: String, default: null },
    email: { type: String, default: "" },
    department: { type: String, default: "" },
    semester: { type: String, default: "" },
    subjectsAssigned: { type: [SubjectAssignmentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);