// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Function to make connect with mongoDB
async function connectDB() {

    try {

        // Attempt to connect to MongoDB using the connection string from the environment variables
        const connect = await mongoose.connect(process.env.MONGO_URI);

        // Log a success message with the connected host
        console.log(`MongoDB Connected: ${connect.connection.host}`);

    } catch (error) {

        // If an error occurs, log the error message
        console.error(`Error: ${error.message}`);

        // Exit the process with a failure code (1) to indicate an error good for eeors
        process.exit(1);

    }

}

// Export the function so it can be used in other files
export default connectDB;
