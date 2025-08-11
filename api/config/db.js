import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://anantawasthi773:X1cRbsftdZYBSzua@cluster11.cctueag.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "Dev_Talk", //DB Name 
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;