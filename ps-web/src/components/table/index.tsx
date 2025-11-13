import React from "react";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

export type PropsColumns = {
  label: string;
  key: string;
};

interface TableProps<T> {
  columns: PropsColumns[];
  data: T[];
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onView?: (id: string | number) => void;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
}: TableProps<T>) {
  return (
    <div className="relative overflow-x-auto z-0">
      <table className="w-full text-sm text-left text-gray-600">
        <TableHeader columns={columns} />
        <tbody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              data={item}
              columns={columns}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
