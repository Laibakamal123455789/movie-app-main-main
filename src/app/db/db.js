import mongoose from "mongoose";

export function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    console.log("DB is already connected");
    return;
  }

  mongoose.connect("mongodb+srv://eshaikram26:<db_password>@cluster0.jd9auqm.mongodb.net//userDetails", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((connect) => {
      console.log("DB connected:", connect.connection.name);
    })
    .catch((err) => {
      console.error("DB connection error:", err.message);
    });
}
