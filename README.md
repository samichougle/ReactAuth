# Dashboard Authentication App

A full-stack authentication system built with React, Node.js, and MongoDB.  
Includes secure user signup, login, email verification, JWT authentication, and password reset functionality.

---

## Features

- User Signup & Login with form validation  
- Email Verification before login  
- JWT-based Authentication for security  
- Forgot / Reset Password with email  
- Cookie-based sessions using react-cookie  
- Modern UI with Chakra UI  
- Responsive & Mobile Friendly  
- Connected to MongoDB Atlas (cloud database)  
- Frontend deployable on Vercel & backend on Render  

---

## What I Learned

Through this project, I gained hands-on experience with:  

- Connecting frontend (React) with backend (Node.js/Express) via REST APIs  
- Using Axios for API calls  
- Understanding & implementing JWT tokens for secure authentication  
- Managing cookies and sessions in React  
- Protecting routes and handling unauthenticated access  
- Sending transactional emails with Nodemailer (verification & password reset)  
- Using MongoDB Atlas for cloud database management  
- Environment variables (.env) for private keys & secrets  
- Hosting frontend "Vercel" and backend "Railway" for free deployment  

---

## Tech Stack

- **Frontend:** React, Vite, Chakra UI, Formik, Yup, React Query  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Nodemailer, Passport.js  
- **Auth:** JWT, Cookies (react-cookie)  
- **Hosting:** Vercel (frontend), Render/Railway (backend)  

---

## Project Overview

This project simulates a real-world authentication system where:  

- Users must register → verify their email → then log in  
- Passwords are securely validated and can be reset via email  
- Authentication is managed via JWT tokens stored in cookies  
- Backend protects routes and ensures only verified users can log in  

---

## Learning Goal

This was built as part of my full-stack learning journey to understand how authentication works across frontend and backend in modern applications.
