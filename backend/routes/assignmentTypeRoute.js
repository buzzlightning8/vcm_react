import express from "express";
import { checkDuplicate } from "../utils/validationHelpers.js";
import { AssignmentType } from "../models/assignmentTypeModel.js";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const assignmentTypes = await AssignmentType.find({});
    return response.status(200).json({
      count: assignmentTypes.length,
      data: assignmentTypes,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to post (create) a meeting type
router.post("/", async (request, response) => {
  try {
    // Check for duplicate assignment type
    const isDuplicate = await checkDuplicate(
      AssignmentType,
      { firstName: request.body.asTypeName },
      response
    );
    if (isDuplicate) return;

    const assignmentType = new AssignmentType(request.body);
    await assignmentType.save();
    return response.status(201).json(assignmentType);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ error: error.message || "Something went wrong." });
  }
});

export default router;
