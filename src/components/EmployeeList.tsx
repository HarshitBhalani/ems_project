"use client";
import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type Employee = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  designation: string;
  salary: number;
};

export function EmployeeList({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Live filter
  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return !term
      ? employees
      : employees.filter((emp) =>
          Object.values(emp)
            .join(" ")
            .toLowerCase()
            .includes(term)
        );
  }, [employees, searchTerm]);

  // Export as Excel (with visible serial ID)
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEmployees.map((emp, idx) => ({
        ID: idx + 1,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        contact: emp.contact,
        designation: emp.designation,
        salary: Math.floor(emp.salary).toString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "employees.xlsx"
    );
  };

  // Export as PDF (with visible serial ID)
  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [[
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Contact",
        "Designation",
        "Salary",
      ]],
      body: filteredEmployees.map((emp, idx) => [
        idx + 1,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.contact,
        emp.designation,
        Math.floor(emp.salary).toString(),
      ]),
      headStyles: { fillColor: [100, 116, 139] },
      margin: { top: 20 },
      styles: { fontSize: 10 },
    });
    doc.save("employees.pdf");
  };

  // Salary helper (no decimals)
  const formatSalary = (salary: number) => Math.floor(salary).toString();

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* --- Search and Export Controls --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            Export PDF
          </Button>
        </div>
      </div>
      {/* --- Employee Table --- */}
      <div className="overflow-x-auto rounded-lg shadow border border-slate-300">
        <table className="min-w-full divide-y divide-slate-300">
          <thead className="bg-slate-200 text-slate-900">
            <tr>
              <th className="px-3 py-2 text-center">ID</th>
              <th className="px-3 py-2 text-left">First Name</th>
              <th className="px-3 py-2 text-left">Last Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Contact</th>
              <th className="px-3 py-2 text-left">Designation</th>
              <th className="px-3 py-2 text-right">Salary</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-500">
                  No employees found
                </td>
              </tr>
            )}
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp._id || idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 text-center">{idx + 1}</td>
                <td className="px-3 py-2 text-left">{emp.firstName}</td>
                <td className="px-3 py-2 text-left">{emp.lastName}</td>
                <td className="px-3 py-2 text-left">{emp.email}</td>
                <td className="px-3 py-2 text-left">{emp.contact}</td>
                <td className="px-3 py-2 text-left">{emp.designation}</td>
                <td className="px-3 py-2 text-right font-semibold">
                  {formatSalary(emp.salary)}
                </td>
                <td className="px-3 py-2 text-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(emp)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm(
                        `Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`
                      )) {
                        onDelete(emp._id!);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
