import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, JWT_KEY } from "../config";

import FormData from "form-data";
import Mailgun from "mailgun.js";

// --------------------------------------------------
// MAILGUN CLIENT
// --------------------------------------------------
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

// --------------------------------------------------
// SIGNUP USER
// --------------------------------------------------
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

// --------------------------------------------------
// SIGNIN USER
// --------------------------------------------------
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

// --------------------------------------------------
// SEND VERIFICATION MAIL
// --------------------------------------------------
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

    // SEND VERIFICATION EMAIL
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM_EMAIL!,
      to: email,
      subject: "Verify Your Email",
      "h:Content-Type": "text/html; charset=UTF-8",
      html: `
      <div style="font-family: Arial; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:8px;">
          <h2 style="text-align:center; color:#4f46e5;">Verify Your Email</h2>
          <p>Hello ${user.firstName},</p> 
          <p>Click the button below to verify your email:</p>
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 25px auto;">
  <tr>
    <td 
      bgcolor="#4f46e5" 
      style="border-radius: 6px; 
             font-size: 16px; 
             text-align: center; 
             padding: 12px 18px;">
      <a 
        href="https://dashboardauth-production.up.railway.app/user/email-verify/${jwtToken}"
        target="_blank"
        style="color: #ffffff; 
               text-decoration: none; 
               font-weight: bold; 
               display: inline-block;">
        Verify Email
      </a>
    </td>
  </tr>
</table>

<p style="color:#555;">Or copy this link:</p>
          <p style="font-size:14px; color:#d62828;">
            https://dashboardauth-production.up.railway.app/user/email-verify/${jwtToken}
          </p>

        </div>
      </div>
      `,
    });

    await user.updateOne({ $set: { verifyToken: encryptedToken } });

    res.json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return next(InternalServerError);
  }
};

// --------------------------------------------------
// SEND FORGOT PASSWORD MAIL
// --------------------------------------------------
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

    // SEND EMAIL USING MAILGUN
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM_EMAIL!,
      to: email,
      subject: "Reset Your Password",
      "h:Content-Type": "text/html; charset=UTF-8",
      html: `
      <div style="font-family: Arial; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:8px;">
          <h2 style="text-align:center; color:#d62828;">Reset Password</h2>

          <p>Hello ${user.firstName},</p>
          <p>You requested to reset your password.</p>

          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 25px auto;">
  <tr>
    <td 
      bgcolor="#4f46e5" 
      style="border-radius: 6px; 
             font-size: 16px; 
             text-align: center; 
             padding: 12px 18px;">
      <a 
        href="${FRONTEND_URL}/forgot-password-verify/${jwtToken}"
        target="_blank"
        style="color: #ffffff; 
               text-decoration: none; 
               font-weight: bold; 
               display: inline-block;">
        Verify Email
      </a>
    </td>
  </tr>
</table>


          <p style="color:#555;">Or copy this link:</p>
          <p style="font-size:14px; color:#d62828;">
            ${FRONTEND_URL}/forgot-password-verify/${jwtToken}
          </p>
        </div>
      </div>
      `,
    });

    await user.updateOne({ $set: { verifyToken: encryptedToken } });

    res.json({ message: "Forgot password email sent" });
  } catch (error) {
    console.error(error);
    return next(InternalServerError);
  }
};

// --------------------------------------------------
// VERIFY USER MAIL
// --------------------------------------------------
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

// --------------------------------------------------
// VERIFY FORGOT MAIL
// --------------------------------------------------
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
