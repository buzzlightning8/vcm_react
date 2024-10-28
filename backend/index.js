import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import publisherRoute from "./routes/publisherRoute.js";
import meetingTypeRoute from "./routes/meetingTypeRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGODB_URL;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Hello!");
});

app.use("/publishers", publisherRoute);
app.use("/meetingTypes", meetingTypeRoute);

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((error) => {
    console.log(error);
  });
