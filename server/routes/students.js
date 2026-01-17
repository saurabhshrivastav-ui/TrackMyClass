const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Create or upsert a student (for testing/seed)
router.post("/", async (req, res) => {
  try {
    const { studentId, name, semester, subjects } = req.body;
    if (!studentId || !name) {
      return res.status(400).json({ message: "studentId and name are required" });
    }

    const doc = await Student.findOneAndUpdate(
      { studentId },
      {
        $set: {
          name,
          semester: semester || "",
          subjects: subjects || [],
        },
      },
      { upsert: true, new: true }
    );

    return res.json(doc);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get student overview (used by OverallScreen)
router.get("/:studentId/overview", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId }).lean();

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const subjects = (student.subjects || []).map((s) => ({
      ...s,
      attended: 0,
      absent: 0,
      percent: 0,
    }));

    const totalClasses = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
    const attended = 0;
    const overallPercent = totalClasses ? Math.round((attended / totalClasses) * 100) : 0;

    res.json({
      student: {
        name: student.name,
        id: student.studentId,
        semester: student.semester,
      },
      subjects,
      stats: {
        totalClasses,
        attended,
        overallPercent,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
