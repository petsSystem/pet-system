import React from "react";

export interface TableColumn {
  title: string;
  width?: string;
  key?: string;
}

interface TableHeaderProps {
  columns: TableColumn[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`px-2 ${index === 0 ? "first:pl-5" : ""} ${
              index === columns.length - 1 ? "last:pr-5" : ""
            } py-3 whitespace-nowrap ${
              column.width ? `w-${column.width}` : ""
            }`}
          >
            <div className="font-semibold text-left">{column.title}</div>
          </th>
        ))}
        <th key="actions" className={`px-2 last:pr-5 py-3 whitespace-nowrap`}>
          <div className="font-semibold text-left">Ações</div>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
