"use client";

import TableHeader from "./ps-table-header";
import TableItem from "./table-item";
import { SkeletonTable } from "@components/skeleton";

export interface TableColumn<T> {
  title: string;
  key: string;
  color?: boolean;
  type?: string;
  mask?: string;
  render?: (item: Record<string, any>) => React.ReactNode;
  booleanDisplay?: { true: string; false: string };
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: any[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export default function Table<T>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  loading,
}: TableProps<T>) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-sm border border-slate-100 dark:border-slate-700 relative">
      <div className="overflow-x-auto">
        <table className="table-auto w-full dark:text-slate-300">
          <TableHeader columns={columns} />
          <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
            {data.map((item, index) => (
              <TableItem
                key={index}
                item={item}
                columns={columns}
                onView={onView && (() => onView(item))}
                onEdit={onEdit && (() => onEdit(item))}
                onDelete={onDelete && (() => onDelete(item))}
              />
            ))}
          </tbody>
        </table>
      </div>
      {loading && <SkeletonTable />}
    </div>
  );
}
