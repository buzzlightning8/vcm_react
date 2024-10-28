import mongoose from "mongoose";

const assignmentTypeSchema = mongoose.Schema({
  asName: { type: String, required: true },
  asDescr: { type: String, required: true },
  asMeetingType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MeetingType",
    required: true,
  },
  asBrotherOnly: { type: Boolean, required: true },
  asDuration: { type: Number, required: true },
});

export const AssignmentType = mongoose.model(
  "AssignmentType",
  assignmentTypeSchema
);
