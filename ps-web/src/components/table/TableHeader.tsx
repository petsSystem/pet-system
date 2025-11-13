import React from "react";
import { PropsColumns } from "./";

interface TableHeaderProps {
  columns: PropsColumns[]; // Array de rótulos das colunas
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        {columns.map((column, index) => (
          <th key={column.key} scope="col" className="px-6 py-3">
            {column.label}
          </th>
        ))}
        <th scope="col" className="px-6 py-3">
          Ações
        </th>
      </tr>
    </thead>
  );
}
