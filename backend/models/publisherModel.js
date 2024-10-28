import mongoose from "mongoose";

const publisherSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["Homme", "Femme"], required: true },
    hasAssignments: { type: Boolean, required: true },
    isElder: { type: Boolean },
    isAssistant: { type: Boolean },
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

export const Publisher = mongoose.model("Publisher", publisherSchema);
