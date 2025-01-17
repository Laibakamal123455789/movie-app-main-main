import { dbConnect } from "./app/db/db";

export function register() {
  dbConnect();
  console.log("Register function executed");
}
