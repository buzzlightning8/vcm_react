import mongoose from "mongoose";

const meetingTypeSchema = mongoose.Schema({
  meetingTypeName: { type: String, required: true },
  meetingTypeDescription: { type: String, required: true },
});

export const MeetingType = mongoose.model("MeetingType", meetingTypeSchema);
