import { IconEdit, IconStore, IconEye, IconDelete } from "@components/icons";
import React from "react";
import { TableCell } from "./TableCell";
import { PropsColumns } from "./";

interface TableRowProps {
  data: Record<string, string | number>;
  columns: PropsColumns[];
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onView?: (id: string | number) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      {columns.map((column) => (
        <TableCell
          key={column.key}
          column={column.key}
          value={data[column.key]}
        />
      ))}
      <td className="px-6 py-4">
        <div className="flex items-center text-gray-500 cursor-pointer gap-2">
          {onView && (
            <button
              className="hover:text-primary-500"
              onClick={() => onView(data.id)}
            >
              {IconEye}
            </button>
          )}
          {onEdit && (
            <button
              className="hover:text-primary-500"
              onClick={() => onEdit(data.id)}
            >
              {IconEdit}
            </button>
          )}
          {onDelete && (
            <button
              className="hover:text-red-500"
              onClick={() => onDelete(data.id)}
            >
              {IconDelete}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
