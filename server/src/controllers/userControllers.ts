import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, JWT_KEY, resend } from "../config";

import FormData from "form-data";
import Mailgun from "mailgun.js";

export const signupUser: RequestHandler = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createHttpError(422, "Email Already Exist!"));

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User Created" });
  } catch (error) {
    return next(InternalServerError);
  }
};

export const signinUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(404, "User not Found!"));
    if (!user.isUserVerified)
      return next(createHttpError(406, "User not Verified"));

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return next(createHttpError(401, "Not Valid Password!"));

    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userId: user.id,
      },
      JWT_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token);

    res.json({ firstName: user.firstName, lastName: user.lastName, token });
  } catch (error) {
    return next(InternalServerError);
  }
};

export const sendVerificationMail: RequestHandler = async (req, res, next) => {
  const { email }: { email: string } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(404, "Email Not Valid!"));

    if (user.isUserVerified)
      return next(createHttpError(406, "User already verified"));

    const encryptedToken = await bcrypt.hash(user._id.toString(), 8);

    const jwtToken = jwt.sign({ userId: user._id }, JWT_KEY, {
      expiresIn: "60m",
    });

    // MAILGUN SETUP
    // -----------------------------
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY!,
      // If your domain is EU-based, uncomment:
      // url: "https://api.eu.mailgun.net",
    });

    // SEND VERIFICATION EMAIL
    // -----------------------------
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM_EMAIL,
      subject: "Email Verification",
      html: `
          Your Verification Link:
          <a href="https://dashboardauth-production.up.railway.app/user/email-verify/${jwtToken}">
            Click Here
          </a>
        `,
    });

    await user.updateOne({ $set: { verifyToken: encryptedToken } });

    res.json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return next(InternalServerError);
  }
};

export const sendForgotPasswordMail: RequestHandler = async (
  req,
  res,
  next
) => {
  const { email }: { email: string } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(404, "Email Not Valid!"));

    const encryptedToken = await bcrypt.hash(user._id.toString(), 8);

    const jwtToken = jwt.sign({ userId: user._id }, JWT_KEY, {
      expiresIn: "60m",
    });

    await resend.emails.send({
      from: "hello.chouglesami@gmail.com",
      to: email,
      subject: "Forgot Password Verification",
      html: `Reset your password <a href="${FRONTEND_URL}/forgot-password-verify/${jwtToken}">Click Here</a>`,
    });

    await user.updateOne({ $set: { verifyToken: encryptedToken } });

    res.json({ message: "Forgot password email sent" });
  } catch (error) {
    console.error(error);
    return next(InternalServerError);
  }
};

export const verifyUserMail: RequestHandler = async (req, res, next) => {
  const { token }: { token: string } = req.body;

  try {
    const decodedToken: any = jwt.verify(token, JWT_KEY);

    const user = await User.findById(decodedToken.userId);
    if (!user) return next(createHttpError(401, "Token Invalid"));

    await user.updateOne({
      $set: { isUserVerified: true },
      $unset: { verifyToken: 0 },
    });

    res.json({ message: "Email Verified!" });
  } catch (error) {
    return next(createHttpError(401, "Token Invalid"));
  }
};

export const verifyForgotMail: RequestHandler = async (req, res, next) => {
  const { token, password }: { token: string; password: string } = req.body;

  try {
    const decodedToken: any = jwt.verify(token, JWT_KEY);

    const user = await User.findById(decodedToken.userId);
    if (!user) return next(createHttpError(401, "Token Invalid"));

    const encryptedPassword = await bcrypt.hash(password, 8);

    await user.updateOne({
      $set: { password: encryptedPassword },
      $unset: { verifyToken: 0 },
    });

    res.json({ message: "Password Changed!" });
  } catch (error) {
    return next(createHttpError(401, "Token Invalid"));
  }
};
