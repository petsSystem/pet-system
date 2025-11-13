import React from "react";
import Image from "next/image";

interface AvatarProps {
  id: string;
  type: "edit" | "add" | "view";
  name: string;
  imageUrl: string;
  isNew?: boolean;
  onClick?: (id: string, action: "edit" | "add" | "view") => void;
}

const Avatar: React.FC<AvatarProps> = ({
  id,
  name,
  imageUrl,
  isNew,
  onClick,
  type,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id, isNew ? "add" : type);
    }
  };

  return (
    <div className="flex flex-col justify-center ">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          className={`hover:bg-primary-900 cursor-pointer relative inline-flex items-start shadow border-${
            isNew ? "primary-500" : "gray-300"
          } border-2 rounded-full hover:border-${
            isNew ? "primary-800" : "gray-900"
          }`}
        >
          {type === "edit" && (
            <div
              className="absolute top-0 right-0 -mr-4 bg-white dark:bg-slate-700 rounded-full border-2 border-primary-500 w-8 h-8"
              aria-hidden="true"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 32 32">
                <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
              </svg>
            </div>
          )}

          <Image
            className="rounded-full"
            src={imageUrl}
            alt={name}
            width={52}
            height={52}
          />
        </button>
      </div>
      <div className="text-center">
        <div className="inline-flex text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white">
          <h2 className="text-md leading-snug justify-center font-semibold">
            {name}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
