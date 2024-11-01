import mongoose from "mongoose";

const publisherSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["Homme", "Femme"], required: true },
    hasAssignments: { type: Boolean, required: true },
    isElder: { type: Boolean },
    isServant: { type: Boolean },
    onlySecondSchool: { type: Boolean },
    asBibleReadingYesNo: { type: Boolean },
    asStartConversationYesNo: { type: Boolean },
    asFollowUpYesNo: { type: Boolean },
    asMakingDisciplesYesNo: { type: Boolean },
    asTalkYesNo: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

publisherSchema.pre("save", async function (next) {
  //Rule: sisters cannot be elder, servant, do Bible reading or talks
  if (this.gender === "Femme") {
    for (const field of [
      "isElder",
      "isServant",
      "asBibleReadingYesNo",
      "asTalkYesNo",
    ]) {
      if (this[field]) {
        return next(new Error(`Sister cannot have ${field} set to true.`));
      }
    }
  }
  // Rule: brother cannot be elder and servant
  if (this.gender === "Homme" && this.isElder && this.isServant) {
    return next(new Error("Brother cannot be both elder and servant."));
  }
  // Check for required fields if hasAssignments is true
  if (this.hasAssignments) {
    for (const field of [
      "asStartConversationYesNo",
      "asFollowUpYesNo",
      "asMakingDisciplesYesNo",
    ]) {
      if (this[field] === undefined) {
        return next(
          new Error(`${field} must be provided when hasAssignments is true.`)
        );
      }
    }
    // Additional fields for men
    if (this.gender === "Homme") {
      for (const field of ["asBibleReadingYesNo", "asTalkYesNo"]) {
        if (this[field] === undefined) {
          return next(
            new Error(
              `${field} must be provided for men when hasAssignments is true.`
            )
          );
        }
      }
    }
  } else {
    for (const field of [
      "asStartConversationYesNo",
      "asFollowUpYesNo",
      "asMakingDisciplesYesNo",
      "asBibleReadingYesNo",
      "asTalkYesNo",
    ]) {
      if (this[field] !== false) {
        return next(
          new Error(`${field} must be false when hasAssignments is false.`)
        );
      }
    }
  }
  next();
});

export const Publisher = mongoose.model("Publisher", publisherSchema);
