// AccordionTableItem.tsx
import { useState, ReactNode, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CategoryItem {
  id: string;
  label: string;
  image?: any;
  description: string;
  type: string;
}

interface AccordionTableItemProps {
  item: CategoryItem;
  isOpen?: boolean;
  onOpen?: Function; //Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  isOnlyOpen?: boolean;
}

export default function AccordionTableItem({
  item,
  isOpen = false,
  onOpen,
  isOnlyOpen = false,
  children,
}: AccordionTableItemProps) {
  const [open, setOpen] = useState<boolean>(isOpen);
  const route = useRouter();

  const handleOpen = () => {
    if (onOpen) {
      onOpen(!open, item.id);
    }

    if (isOnlyOpen) {
      setOpen(!open);
    } else {
      setOpen(!open);
    }
  };

  const handleNew = () => {
    route.push(`/services/${item.id}?action=add`);
  };

  return (
    <tbody className="text-sm">
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center text-slate-800">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full mr-2 sm:mr-3">
              <Image
                className="rounded-full ml-1"
                src={"/logo.png"}
                width={40}
                height={40}
                alt={item.label}
              />
            </div>
            <div className="font-medium text-slate-800 dark:text-slate-100">
              {item.type}
            </div>
          </div>
        </td>
        {/* <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left">{item.email}</div>
        </td> */}
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left">{item.label}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left">{item.description}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"></td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 ${
                isOpen && "rotate-180"
              }`}
              aria-expanded={open}
              onClick={handleOpen}
              aria-controls={`description-${item.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr
        id={`description-${item.id}`}
        role="region"
        className={`${!isOpen && "hidden"}`}
      >
        <td colSpan={10} className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400 p-3 -mt-3">
            <div className="flex justify-end">
              <button
                onClick={handleNew}
                className="btn bg-primary-500 hover:bg-primary-600 text-white flex mb-2 p-1 font-medium text-sm inline-flex items-center justify-center border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out"
              >
                <svg
                  className="w-3 h-3 fill-current opacity-90 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="block ml-1">novo serviço</span>
              </button>
            </div>
            <div className="text-sm mb-3">{children}</div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
