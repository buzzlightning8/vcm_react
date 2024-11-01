import express from "express";
import { Assignment } from "../models/assignmentModel.js";

const router = express.Router();

async function checkDuplicate(request) {
  const { asType, asAssignee, asAssistant, asTitle, asDate } = request.body;
  const existingAssignment = await Assignment.findOne({
    asType,
    asAssignee,
    asAssistant,
    asTitle,
    asDate,
  });

  return existingAssignment !== null;
}

// Route to retrieve all assignments
router.get("/", async (request, response) => {
  try {
    const assignments = await Assignment.find({});
    return response.status(200).json({
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get one assignment by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const assignment = await Assignment.findById(id)
      .populate("asType")
      .populate("asAssignee")
      .populate("asAssistant");
    if (!assignment) {
      return response.status(404).json({ error: "Assignment not found." });
    }
    return response.status(200).json(assignment);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to post (create) an assignment
router.post("/", async (request, response) => {
  try {
    // Check for duplicate meeting type
    const isDuplicate = await checkDuplicate(request);
    if (isDuplicate) {
      return response
        .status(400)
        .json({ error: "Duplicate assignment detected." });
    }
    const assignment = new Assignment(request.body);
    await assignment.save();
    return response.status(201).json(assignment);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ error: error.message || "Something went wrong." });
  }
});

export default router;
