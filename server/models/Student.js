const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    attended: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    color: { type: String, default: "#4CAF50" },
    absent: { type: Number, default: 0 },
  },
  { _id: false }
);

const StudentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    semester: { type: String, default: "" },
    subjects: { type: [SubjectSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
