"use client";
import React, { useState, useEffect } from "react";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeList, Employee } from "../components/EmployeeList";
import { Button } from "../components/ui/button";

export default function Page() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load employees from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) {
      setEmployees(JSON.parse(stored));
    }
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleAddEmployee = (data: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      id: employees.length > 0 ? employees[employees.length - 1].id + 1 : 1,
      ...data,
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setShowForm(false);
  };

  const handleUpdateEmployee = (data: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === data.id ? { ...data } : emp))
    );
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    if (editingEmployee?.id === id) {
      setEditingEmployee(null);
      setShowForm(false);
    }
  };

  const startEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowForm(true);
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
            <Button className="w-full max-w-xs" onClick={() => setShowForm(true)}>
              + Add New Employee
            </Button>
          </div>
        )}
        {showForm && (
          <EmployeeForm
            initialData={editingEmployee}
            onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
            onCancel={cancelForm}
          />
        )}
        <EmployeeList
          employees={employees}
          onEdit={startEdit}
          onDelete={handleDeleteEmployee}
        />
      </div>
    </main>
  );
}
