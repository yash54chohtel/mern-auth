import express from "express"; // Importing express
import userAuth from "../middleware/userAuth.js"; // Imporgin User Authentication middleware

// Importing controller function
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendPassResetOtp, resetPassword, getUserData } from "../controllers/authController.js"; 

const authRouter = express.Router(); // Created a router instance

// -------------------- AUTHENTICATION ROUTES -------------------- //

// register route [POST]
authRouter.post("/register", register); // 'http://localhost:3000/api/auth/register'

// login route [POST]
authRouter.post("/login", login); // 'http://localhost:3000/api/auth/login'

// logout route [POST]
authRouter.post("/logout", logout); // 'http://localhost:3000/api/auth/logout'

// send verify otp [POST]
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp) // 'http://localhost:3000/api/auth/send-verify-otp'

// verify account with otp [POST]
authRouter.post("/verify-email", userAuth, verifyEmail) // 'http://localhost:3000/api/auth/verify-email'

// Check is user Authenticated [GET]
authRouter.get("/is-auth", userAuth, isAuthenticated) // 'http://localhost:3000/api/auth/is-auth'

// Send pasword reset OTP [POST]
authRouter.post("/send-pass-reset-otp", sendPassResetOtp) // 'http://localhost:3000/api/auth/send-pass-reset-otp'

// Reset password [POST]
authRouter.post("/reset-password", resetPassword) // 'http://localhost:3000/api/auth/reset-password'

// Reset password [GET]
authRouter.get("/get-user-data", userAuth, getUserData) // 'http://localhost:3000/api/auth/get-user-data'


export default authRouter; // exporting the authRouter
