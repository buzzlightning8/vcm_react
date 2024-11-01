import mongoose from "mongoose";

const assignmentTypeSchema = mongoose.Schema({
  asTypeName: { type: String, required: true },
  asTypeMeetingType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MeetingType",
    required: true,
  },
  asTypeBrotherOnly: { type: Boolean, required: true },
  asTypeAppointedOnly: { type: Boolean },
  asTypeElderOnly: { type: Boolean },
  asTypeDuration: { type: Number }, // Duration in minutes
  asTypeWithAssistant: { type: Boolean },
});

assignmentTypeSchema.pre("save", async function (next) {
  //Rule: if brother only, cannot have assistant
  if (this.asTypeBrotherOnly && this.asTypeWithAssistant) {
    return next(
      new Error("Brother-only assignment type cannot have assistant.")
    );
  }
  //Rule: if elder only, cannot have assistant
  if (this.asTypeElderOnly && this.asTypeWithAssistant) {
    return next(new Error("Elder-only assignment type cannot have assistant."));
  }
  //Rule: if elder only, cannot have asTypeBrotherOnly set to false
  if (!this.asTypeBrotherOnly && this.asTypeElderOnly) {
    return next(
      new Error(
        "Elder-only assignment type cannot have asTypeBrotherOnly set to false."
      )
    );
  }
  next();
});

export const AssignmentType = mongoose.model(
  "AssignmentType",
  assignmentTypeSchema
);
