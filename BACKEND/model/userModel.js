import mongoose from "mongoose"; // Import mongoose

// Define the User schema 
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpiredAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpiredAt: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

// Create the User model
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// Export the model using ES Module syntax
export default UserModel;
