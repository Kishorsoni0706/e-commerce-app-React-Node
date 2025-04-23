const mongoose = require("mongoose");
const uri = "mongodb://127.0.0.1:27017/e-commerce"; // Replace with your database name
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected successfully :white_check_mark:");
    } catch (error) {
        console.error("MongoDB connection error :x::", error);
        process.exit(1);
    }
};
module.exports = connectDB;