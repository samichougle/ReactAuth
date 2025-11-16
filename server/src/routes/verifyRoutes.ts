import express from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../model/User";
import { JWT_KEY, FRONTEND_URL } from "../config";

const router = express.Router();

router.get("/email-verify/:token", async (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded: any = jwt.verify(token, JWT_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send("Invalid or expired token");

    await user.updateOne({
      $set: { isUserVerified: true },
      $unset: { verifyToken: 0 },
    });

    // ✅ Redirect to frontend page with token
    res.redirect(`${FRONTEND_URL}/email-verify/${token}`);
  } catch (error) {
    return next(createHttpError(400, "Invalid or expired token"));
  }
});

export default router;
