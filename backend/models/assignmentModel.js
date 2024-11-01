import mongoose from "mongoose";
import { Publisher } from "./publisherModel.js";
import { AssignmentType } from "./assignmentTypeModel.js";

const assignmentSchema = mongoose.Schema({
  asType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssignmentType",
    required: true,
  },
  asAssignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  asAssistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
  },
  asDate: {
    type: Date,
    required: true,
  },
  asTitle: {
    type: String,
  },
});

assignmentSchema.pre("save", async function (next) {
  if (this.asDate) {
    this.asDate.setUTCHours(0, 0, 0, 0);
  }
  const assignmentType = await AssignmentType.findById(this.asType);
  const publisher = await Publisher.findById(this.asAssignee);
  if (!assignmentType) {
    return next(new Error("Invalid assignment type."));
  }

  if (assignmentType.asTypeBrotherOnly && !(publisher.gender === "Homme")) {
    return next(
      new Error("Assignee must be a male publisher for this assignment type.")
    );
  }

  if (assignmentType.asTypeElderOnly && !publisher.isElder) {
    return next(
      new Error("Assignee must be an elder for this assignment type.")
    );
  }

  if (!assignmentType.asTypeWithAssistant && this.asAssistant) {
    return next(new Error("This assignment type does not allow an assistant."));
  }

  next();
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);
