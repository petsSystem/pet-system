import Link from "next/link";

interface Props {
  url: string;
  text: string;
  icon: any;
}

export function MenuItem({ url, text, icon }: Props) {
  return (
    <li className="hover:bg-gray-100 cursor-pointer">
      <Link
        className="flex flex-col justify-center items-center h-20 w-20 w-full"
        href={url}
      >
        {icon}
        <span className="text-xs font-light text-gray-700">{text}</span>
      </Link>
    </li>
  );
}
