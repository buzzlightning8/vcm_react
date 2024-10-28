import express from "express";
import { checkDuplicate } from "../utils/validationHelpers.js";
import { Publisher } from "../models/publisherModel.js";

const router = express.Router();

function runChecks(publisherData) {
  //Rule: men cannot be both elder and assistant
  if (
    publisherData.gender === "Homme" &&
    publisherData.isElder &&
    publisherData.isAssistant
  ) {
    return {
      error: "Brother cannot be both elder and assistant.",
    };
  }
  // Check for required fields if hasAssignments is true
  if (publisherData.hasAssignments) {
    for (const field of [
      "asStartConversationYesNo",
      "asFollowUpYesNo",
      "asMakingDisciplesYesNo",
    ]) {
      if (publisherData[field] === undefined) {
        return {
          error: `${field} must be provided when hasAssignments is true.`,
        };
      }
    }
    // Additional fields for men
    if (publisherData.gender === "Homme") {
      for (const field of ["asBibleReadingYesNo", "asTalkYesNo"]) {
        if (publisherData[field] === undefined) {
          return {
            error: `${field} must be provided for men when hasAssignments is true.`,
          };
        }
      }
    }
  }
  return null; // No errors
}

router.get("/", async (request, response) => {
  try {
    const publishers = await Publisher.find({});
    return response.status(200).json({
      count: publishers.length,
      data: publishers,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to post (create) a publisher
router.post("/", async (request, response) => {
  try {
    // Check for duplicate publisher
    const isDuplicate = await checkDuplicate(
      Publisher,
      {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        gender: request.body.gender,
      },
      response
    );
    if (isDuplicate) return;

    // Run validation checks
    const validationCheckResult = runChecks(request.body);
    if (validationCheckResult) {
      return response.status(400).json({ error: validationCheckResult.error });
    }

    const publisher = new Publisher(request.body);
    await publisher.save();
    return response.status(201).json(publisher);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ error: error.message || "Something went wrong." });
  }
});

// Route to get one publisher by id
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Publisher.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to update a publisher
router.put("/:id", async (request, response) => {
  try {
    // Run validation checks
    const validationCheckResult = runChecks(request.body);
    if (validationCheckResult) {
      return response.status(400).json({ error: validationCheckResult.error });
    }

    const publisher = await Publisher.findByIdAndUpdate(id, request.body);
    if (!publisher) {
      return response.status(404).json({ message: "Publisher not found" });
    }
    return response
      .status(200)
      .send({ message: "Publisher updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to delete a publisher
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Publisher.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "Publisher not found" });
    }
    return response
      .status(200)
      .send({ message: "Publisher deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
