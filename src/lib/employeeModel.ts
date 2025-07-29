import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
