// components/Breadcrumb.tsx
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <ul className="inline-flex flex-wrap text-sm font-medium">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          <Link
            href={item.href}
            className="text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-500"
          >
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <svg
              className="h-4 w-4 fill-current text-slate-400 dark:text-slate-600 mx-3"
              viewBox="0 0 16 16"
            >
              <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
            </svg>
          )}
        </li>
      ))}
    </ul>
  );
};
