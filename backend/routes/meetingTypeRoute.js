import express from "express";
import { checkDuplicate } from "../utils/validationHelpers.js";
import { MeetingType } from "../models/meetingTypeModel.js";

const router = express.Router();

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
    // Check for duplicate meeting type
    const isDuplicate = await checkDuplicate(
      MeetingType,
      request.body,
      response
    );
    if (isDuplicate) return;

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

// Route to get one meeting type by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await MeetingType.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to update a meeting type
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const meetingType = await MeetingType.findByIdAndUpdate(id, request.body);
    if (!meetingType) {
      return response.status(404).json({ message: "MeetingType not found" });
    }
    return response
      .status(200)
      .send({ message: "MeetingType updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to delete a meeting type
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await MeetingType.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "MeetingType not found" });
    }
    return response
      .status(200)
      .send({ message: "MeetingType deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
