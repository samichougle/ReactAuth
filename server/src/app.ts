import express, { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import exampleRoute from "./routes/exampleRoutes";
import userRoute from "./routes/userRoutes";
import mongoose from "mongoose";
import { DB, PORT } from "./config";
import { errorHandler } from "./middleware/errorHanlder";
import passport from "passport";
import kPassport from "./middleware/passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import verifyRoute from "./routes/verifyRoutes";
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://dashboard-auth-drab.vercel.app", // your Vercel domain
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
kPassport(passport);

app.use("/", exampleRoute);
app.use("/user", userRoute);

// app.use(() => {
//   throw createHttpError(404, "Route not found");
// });

app.use(errorHandler);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, () => {
      console.log(`Listening On PORT ${PORT}`);
    });
  })
  .catch(() => {
    throw createHttpError(501, "Unable to connect database");
  });

app.use("/user", verifyRoute);
