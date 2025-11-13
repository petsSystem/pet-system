import { formatNumberToCurrency } from "@/src/utils/formatNumberToCurrency";
import { formatWithMask } from "@/src/utils/mask";
import React from "react";
import { TableColumn } from "./";

interface TableItemProps<T> {
  item: any;
  columns: TableColumn<T>[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRead?: (item: T) => void;
}

export default function TableItem<T>({
  item,
  columns,
  onView,
  onEdit,
  onDelete,
}: TableItemProps<T>) {
  return (
    <tr>
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ${
            column.render ? "flex items-center" : ""
          }`}
        >
          {column.render ? (
            column.render(item)
          ) : column.color ? (
            <div className={`font-medium text-${column.type || "sky-500"}`}>
              {column.type === "status" ? (
                <div
                  className={`inline-flex rounded-full text-center px-2.5 py-0.5 ${
                    (item as unknown as Record<string, boolean>)[column.key] ===
                    true
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {(item as unknown as Record<string, string>)[column.key]
                    ? "Ativo"
                    : "Inativo"}
                </div>
              ) : (
                (item as unknown as Record<string, string>)[column.key]
              )}
            </div>
          ) : column.type === "currency" ? (
            <div>
              {formatNumberToCurrency(
                Number((item as unknown as Record<string, string>)[column.key])
              )}
            </div>
          ) : column.mask ? (
            <div>
              {formatWithMask(
                (item as unknown as Record<string, string>)[column.key],
                column.mask
              )}
            </div>
          ) : column.booleanDisplay ? (
            <div
              className={`${
                (item as unknown as Record<string, string>)[column.key]
                  ? "text-amber-500"
                  : "text-emerald-600"
              }`}
            >
              {(item as unknown as Record<string, string>)[column.key]
                ? column.booleanDisplay.true
                : column.booleanDisplay.false}
            </div>
          ) : (
            <div>{(item as unknown as Record<string, string>)[column.key]}</div>
          )}
        </td>
      ))}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="space-x-1">
          {onView && (
            <button
              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
              onClick={() => onView(item)}
            >
              <span className="sr-only">Visualizar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 icon icon-tabler icon-tabler-eye stroke-current"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="2"
                fill="none"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
              onClick={() => onEdit(item)}
            >
              <span className="sr-only">Editar</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className="text-rose-500 hover:text-rose-600 rounded-full"
              onClick={() => onDelete(item)}
            >
              <span className="sr-only">Excluir</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
