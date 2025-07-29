"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";

const employeeSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().max(10, "Contact should be at least 10 digits"),
  designation: z.string().min(1, "Designation is required"),
  salary: z.number().min(0, "Salary must be positive"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function EmployeeForm({
  onSubmit,
  initialData,
  onCancel,
}: {
  onSubmit: (data: EmployeeFormData) => void;
  initialData?: EmployeeFormData | null;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      designation: "",
      salary: 0,
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  useEffect(() => {
    if (isSubmitSuccessful && !initialData) reset();
  }, [isSubmitSuccessful, initialData, reset]);

  // Responsive 3 row 2 column grid
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-4 bg-slate-50 rounded-lg shadow-md space-y-4"
      noValidate
    >
      {/* 3 Rows, 2 Columns each, responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1 */}
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} className={cn(errors.firstName && "border-red-500")} />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} className={cn(errors.lastName && "border-red-500")} />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
        {/* Row 2 */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} className={cn(errors.email && "border-red-500")} />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Input id="contact" {...register("contact")} className={cn(errors.contact && "border-red-500")} />
          {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact.message}</p>}
        </div>
        {/* Row 3 */}
        <div>
          <Label htmlFor="designation">Designation</Label>
          <Input id="designation" {...register("designation")} className={cn(errors.designation && "border-red-500")} />
          {errors.designation && <p className="text-red-600 text-sm mt-1">{errors.designation.message}</p>}
        </div>
        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input id="salary" type="number" step="0.01" {...register("salary", { valueAsNumber: true })} className={cn(errors.salary && "border-red-500")} />
          {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary.message}</p>}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          className="w-full max-w-xs"
        >
          {initialData ? "Update" : "Add"} Employee
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
