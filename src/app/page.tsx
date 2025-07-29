"use client";
import React, { useState } from "react";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeList, Employee } from "../components/EmployeeList";
import { useEmployees } from "../lib/useEmployees";
import { Button } from "../components/ui/button";

// The EmployeeForm expects Omit<Employee, "_id"> for submit data
type EmployeeFormInput = Omit<Employee, "_id">;

export default function Page() {
  const {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Add handler: data is Omit<Employee, "_id">
  const handleAddEmployee = async (data: EmployeeFormInput) => {
    await addEmployee(data);
    setShowForm(false);
  };

  // Update handler: data is Omit<Employee, "_id">
  const handleUpdateEmployee = async (data: EmployeeFormInput) => {
    if (editingEmployee && editingEmployee._id) {
      await updateEmployee(editingEmployee._id, data);
    }
    setEditingEmployee(null);
    setShowForm(false);
  };

  const cancelForm = () => {
    setEditingEmployee(null);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Employee Management System
        </h1>
        {!showForm && (
          <div className="text-center mb-6">
            <Button
              className="w-full max-w-xs"
              onClick={() => setShowForm(true)}
            >
              + Add New Employee
            </Button>
          </div>
        )}
        {showForm && (
          <EmployeeForm
            initialData={
              editingEmployee
                ? {
                    firstName: editingEmployee.firstName,
                    lastName: editingEmployee.lastName,
                    email: editingEmployee.email,
                    contact: editingEmployee.contact,
                    designation: editingEmployee.designation,
                    salary: editingEmployee.salary,
                  }
                : undefined
            }
            onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
            onCancel={cancelForm}
          />
        )}
        <EmployeeList
          employees={employees}
          onEdit={(emp) => {
            setEditingEmployee(emp);
            setShowForm(true);
          }}
          onDelete={(id) => deleteEmployee(id)}
        />
        {loading && <div className="text-center py-2">Loading...</div>}
      </div>
    </main>
  );
}
