import Link from "next/link";
import { IconAdd } from "./icons";

type Props = {
  icon: JSX.Element;
  href: string;
};

export const FloatingButton = ({ icon, href }: Props) => {
  return (
    <div className="">
      <Link
        href={href}
        className="fixed right-16 bottom-16 w-16 h-16 bg-primary-500  hover:bg-primary-600 text-white font-bold rounded-full shadow-lg flex justify-center items-center"
      >
        {icon}
      </Link>
    </div>
  );
};
