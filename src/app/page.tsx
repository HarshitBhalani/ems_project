"use client";
import React, { useState } from "react";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeList } from "../components/EmployeeList";
import { useEmployees, Employee } from "../lib/useEmployees";
import { Button } from "../components/ui/button";

export default function Page() {
  const {
    employees, loading,
    addEmployee, updateEmployee, deleteEmployee
  } = useEmployees();

  const [editing, setEditing] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (data: Omit<Employee, "_id">) => {
    await addEmployee(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: Employee) => {
    if (data._id) await updateEmployee(data._id, data);
    setEditing(null);
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
            <Button className="w-full max-w-xs"
                    onClick={() => setShowForm(true)}>
              + Add New Employee
            </Button>
          </div>
        )}
        {showForm && (
          <EmployeeForm
            initialData={editing || undefined}
            onSubmit={editing ? handleUpdate : handleAdd}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}
        <EmployeeList
          employees={employees}
          onEdit={(emp) => { setEditing(emp); setShowForm(true); }}
          onDelete={(id) => deleteEmployee(id)}
        />
        {loading && <div className="text-center py-2">Loading...</div>}
      </div>
    </main>
  );
}
