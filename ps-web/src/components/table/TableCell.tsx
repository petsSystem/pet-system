import React from "react";

interface CellProps {
  column: string;
  value: string | number | boolean;
}

interface TableRowProps {
  data: Record<string, string | number | boolean>;
  columns: string[];
}

export const TableCell: React.FC<CellProps> = ({ column, value }) => {
  return (
    <td className="px-6 py-4">
      {column === "active" ? (
        <div className="flex items-center">
          <div
            className={`h-2.5 w-2.5 rounded-full animate-pulse bg-green-500 scale-110 bg-${
              value ? "green" : "red"
            }-500 mr-2`}
          ></div>
          {value ? "Ativo" : "Inativo"}
        </div>
      ) : (
        value
      )}
    </td>
  );
};
