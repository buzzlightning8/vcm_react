import express from "express";
import { checkDuplicate } from "../utils/validationHelpers.js";
import { Publisher } from "../models/publisherModel.js";

const router = express.Router();

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
    const { id } = request.params;
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return response.status(404).json({ message: "Publisher not found" });
    }
    Object.assign(publisher, request.body);
    await publisher.save();
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
