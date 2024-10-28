import express from "express";
import { AssignmentType } from "../models/assignmentTypeModel.js";

const router = express.Router();

// Async function to check if a publisher with the same name and gender exists
async function checkDuplicateMeetingType(meetingTypeData) {
  const existingMeetingType = await MeetingType.findOne({
    meetingTypeName: {
      $regex: new RegExp(`^${meetingTypeData.meetingTypeName}$`, "i"),
    },
    meetingTypeDescription: {
      $regex: new RegExp(`^${meetingTypeData.meetingTypeDescription}$`, "i"),
    },
  });

  if (existingMeetingType) {
    return {
      error:
        "A meeting type with the same name and description already exists.",
    };
  }
  return null; // No duplicate found
}

router.get("/", async (request, response) => {
  try {
    const meetingTypes = await MeetingType.find({});
    return response.status(200).json({
      count: meetingTypes.length,
      data: meetingTypes,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to post (create) a meeting type
router.post("/", async (request, response) => {
  try {
    // Check for duplicate publisher
    const duplicateCheckResult = await checkDuplicateMeetingType(request.body);
    if (duplicateCheckResult) {
      return response.status(409).json({ error: duplicateCheckResult.error });
    }

    const meetingType = new MeetingType(request.body);
    await meetingType.save();
    return response.status(201).json(meetingType);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ error: error.message || "Something went wrong." });
  }
});

export default router;
