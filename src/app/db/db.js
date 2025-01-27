import mongoose from "mongoose";

export function dbConnect() {
  console.log("Connecting to MongoDB...");

  if (mongoose.connection.readyState >= 1) {
    console.log("DB is already connected");
    return;
  }

  mongoose.connect(process.env.MONGODB_URI)
    .then((connect) => {
      console.log("DB connected:", connect.connection.name);
    })
    .catch((err) => {
      console.error("DB connection error:", err.message);
    });
}
