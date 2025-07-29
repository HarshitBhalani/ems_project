import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Employee from "@/lib/employeeModel";

// GET /api/employees
export async function GET() {
  await dbConnect();
  const employees = await Employee.find().sort({ createdAt: -1 });
  return NextResponse.json(employees);
}

// POST /api/employees
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  const emp = await Employee.create(data);
  return NextResponse.json(emp, { status: 201 });
}

// PUT /api/employees?id=xxx
export async function PUT(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const emp = await Employee.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(emp);
}

// DELETE /api/employees?id=xxx
export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await Employee.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
