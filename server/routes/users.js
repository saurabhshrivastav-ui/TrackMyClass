const express = require("express");
const User = require("../models/User");

const router = express.Router();

const buildUserPayload = (user) => {
  const classesAssigned = user.subjectsAssigned?.length || 0;
  const totalStudents = user.subjectsAssigned?.reduce(
    (sum, s) => sum + (s.totalStudents || (s.students?.length || 0)),
    0
  ) || 0;

  return {
    id: user.userId,
    role: user.role,
    name: user.name,
    phone: user.phoneNumber,
    phoneNumber: user.phoneNumber,
    email: user.email,
    department: user.department,
    semester: user.semester,
    class: user.class,
    className: user.class,
    rollNo: user.rollNumber,
    rollNumber: user.rollNumber,
    subjects: user.subjects,
    subjectsAssigned: user.subjectsAssigned || [],
    stats: {
      classesAssigned,
      totalStudents,
    },
  };
};

// Get user by phone (login)
router.get("/phone/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const digits = String(phone).replace(/\D/g, "");
    const tail10 = digits.length > 10 ? digits.slice(-10) : digits;
    const tail9 = digits.length > 9 ? digits.slice(-9) : digits;

    const orConditions = [
      { phoneNumber: phone },
      { phoneNumber: digits },
      { phoneNumber: `+${digits}` },
      { phoneNumber: tail10 },
      { phoneNumber: `+${tail10}` },
      { phoneNumber: tail9 },
      { phoneNumber: `+${tail9}` },
    ];

    // If user enters only national number (e.g., 10 digits), allow matches like +91XXXXXXXXXX.
    if (digits.length >= 7) {
      orConditions.push({ phoneNumber: { $regex: `${digits}$` } });
      if (tail10 && tail10 !== digits) orConditions.push({ phoneNumber: { $regex: `${tail10}$` } });
      if (tail9 && tail9 !== digits && tail9 !== tail10) orConditions.push({ phoneNumber: { $regex: `${tail9}$` } });
    }

    const user = await User.findOne({ $or: orConditions }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(buildUserPayload(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Teacher subjects for attendance flow
router.get("/teachers/:teacherId/subjects", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const user = await User.findOne({ userId: teacherId, role: "teacher" }).lean();

    if (!user) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.json({
      teacher: { id: user.userId, name: user.name },
      subjects: user.subjectsAssigned || [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get user by id (profile)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(buildUserPayload(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;