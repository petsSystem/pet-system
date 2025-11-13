import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@hooks/useApp";

interface SidebarLinkProps {
  children: React.ReactNode;
  href: string;
}

export default function SidebarLink({ children, href }: SidebarLinkProps) {
  const pathname = usePathname();
  const { setSidebarOpen } = useApp();

  return (
    <Link
      className={`block text-slate-200 hover:text-white transition duration-150 truncate ${
        pathname === href
          ? "group-[.is-link-group]:text-indigo-500"
          : "group-[.is-link-group]:text-slate-400 hover:text-slate-200 hover:group-[.is-link-group]:text-slate-200"
      }`}
      href={href}
      onClick={() => setSidebarOpen(false)}
    >
      {children}
    </Link>
  );
}
