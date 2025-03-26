import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Import jwt for token generation
import UserModel from '../model/userModel.js'; // Import the User model
import transporter from '../config/nodemailer.js'; // Import transporter to send email


// -------------------- REGISTRATION CONTROLLER -------------------- //

export const register = async (req, res) => {

    try {

        // Extract user details from request body
        const { name, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing user details"
            });
        }

        // Check if a user with the given email already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        const savedUser = await user.save();

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Store the token in an HTTP-only cookie for security
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Adjust CORS settings
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
        });

        // Sending welcome email to user email with the Nodemailer and Brevo
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to us",
            text: `Welcome to us your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        console.log("userdetail : " + savedUser); // to remove
        console.log("token : " + token); // to remove
        console.log("-------------- ↑ register controller"); // to remove

        // Send a success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email } // Sending user data without password
        });

    } catch (error) {

        // Handle errors and send an appropriate response
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// -------------------- LOGIN CONTROLLER -------------------- //

export const login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password required"
            });
        }

        // Find the user by email in the database
        const user = await UserModel.findOne({ email });

        // If user not found, return error
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If password is incorrect, return error
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Store the token in an HTTP-only cookie for security
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Adjust CORS settings
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
        });

        console.log("user : " + user); // to remove
        console.log("token : " + token); // to remove
        console.log("-------------- ↑ login controller"); // to remove

        // Send a success response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
        });

    } catch (error) {

        // Handle errors and send an appropriate response
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// -------------------- LOGOUT CONTROLLER -------------------- //

export const logout = async (req, res) => {

    try {

        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        // Success response
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {

        // Error response 
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// -------------------- SEND VERIFY OTP CONTROLLER -------------------- //

export const sendVerifyOtp = async (req, res) => {

    try {

        // Extract userId from req.userId (token will send the id by req.userId from userAuth middleware)
        const userId = req.userId;

        // Find user by ID in database
        const user = await UserModel.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user is already verified
        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: "Account already verified",
            });
        }

        // Generate a 6-digit random OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Store OTP in the user document along with expiration time (24 hours)
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

        // Save the updated user data in the database
        await user.save();

        // Configure email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender email (from environment variable)
            to: user.email, // Recipient email
            subject: "Account Verification OTP", // Email subject
            text: `Your verification OTP is: ${otp}` // Email body
        };

        // Send email with OTP
        const emailResponse = await transporter.sendMail(mailOptions);

        // Debugging logs (Remove in production)
        console.log("User details:", user);
        console.log("Email response:", emailResponse);
        console.log("-------------- ↑ send verify otp");

        // Success response
        return res.status(200).json({
            success: true,
            message: `Verification OTP sent to email ${user.email} successfully`
        });

    } catch (error) {

        // Error handling response
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// -------------------- VERIFY EMAIL CONTROLLER -------------------- //

export const verifyEmail = async (req, res) => {

    try {

        // Extract otp from request body
        const { otp } = req.body;

        // Extract userId from req.userId (token will send the id by req.userId from userAuth middleware)
        const userId = req.userId;

        // Check if userId and OTP are provided
        if (!userId || !otp) {
            return res.status(400).json({
                success: false,
                message: "Missing details: userId and OTP are required"
            });
        }

        // Find user by ID in the database
        const user = await UserModel.findById(userId);

        // If user is not found, return 404 error
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if OTP is empty or incorrect
        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check if OTP is expired
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        // Mark account as verified
        user.isAccountVerified = true;

        // Clear OTP
        user.verifyOtp = "";

        // Reset expiration time
        user.verifyOtpExpiredAt = 0;

        // Save changes to database
        await user.save();

        // Debugging logs (Remove in production)
        console.log("User details after verification:", user);
        console.log("-------------- ↑ verify email");

        // Success response
        return res.status(200).json({
            success: true,
            message: `Email ${user.email} verified successfully`
        });

    } catch (error) {

        // Error handling response
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// -------------------- CHECK USER AUTHENTICATED CONTROLLER -------------------- //

export const isAuthenticated = async (req, res) => {

    try {

        // Success response
        return res.status(200).json({
            success: true,
            message: `User if Authenticated`
        });

    } catch (error) {

        // Error handling response
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// -------------------- SEND PASSWORD RESET OTP CONTROLLER -------------------- //

export const sendPassResetOtp = async (req, res) => {

    try {

        // Extract email from request body
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate a 6-digit random OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Hash the OTP before storing (Security improvement)
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Set OTP and expiry time (5 minutes from now)
        user.resetOtp = hashedOtp;
        user.resetOtpExpiredAt = Date.now() + 1 * 60 * 1000; // 10 minutes

        // Save OTP to database
        await user.save();

        // Configure email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender email (from environment variable)
            to: user.email, // Recipient email
            subject: "Password Reset OTP", // Email subject
            text: `Password Reset OTP is: ${otp}. It will expire in 10 minutes` // Email body
        };

        // Send email with OTP
        const emailResponse = await transporter.sendMail(mailOptions);

        // Debugging logs (Remove in production)
        console.log("User details:", user);
        console.log("Email response:", emailResponse);
        console.log("-------------- ↑ send password reset otp");

        // Success response
        return res.status(200).json({
            success: true,
            message: `Password reset OTP sent to email ${user.email} successfully`
        });

    } catch (error) {

        // Error handling response
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// -------------------- RESET PASSWORD CONTROLLER -------------------- //

export const resetPassword = async (req, res) => {

    try {

        // Extract email, OTP, and new password from request body
        const { email, otp, newPassword } = req.body;

        // Validate input fields
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP, and new password are required",
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        // If user does not exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if OTP is expired
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Compare the entered OTP with the hashed OTP stored in the database
        const isOtpValid = await bcrypt.compare(otp, user.resetOtp);

        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;

        // Clear OTP and expiry
        user.resetOtp = null;
        user.resetOtpExpiredAt = 0;

        // Save updated user data
        await user.save();

        // Debugging logs (Remove in production)
        console.log("User details:", user);
        console.log("-------------- ↑ reset password");

        // Success response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {

        // Error handling response
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}

// -------------------- GET USER DATA CONTROLLER -------------------- //

export const getUserData = async (req, res) => {

    try {

        // Extracting user id from req.userId send from userAuth Middleware.
        const userId = req.userId;

        // finding user by userID
        const user = await UserModel.findById(userId);

        // If user does not exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // return succes response with userData
        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        })


    } catch (error) {

        // Error handling response
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}