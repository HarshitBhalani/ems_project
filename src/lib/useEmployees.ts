import { useEffect, useState } from "react";

export type Employee = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  designation: string;
  salary: number;
};

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Load on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
    setLoading(false);
  };

  const addEmployee = async (emp: Omit<Employee, "_id">) => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp),
    });
    if (res.ok) fetchEmployees();
  };

  const updateEmployee = async (id: string, emp: Omit<Employee, "_id">) => {
    const res = await fetch(`/api/employees?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp),
    });
    if (res.ok) fetchEmployees();
  };

  const deleteEmployee = async (id: string) => {
    const res = await fetch(`/api/employees?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchEmployees();
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployees,
  };
}
