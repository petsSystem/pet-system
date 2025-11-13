import React from "react";
import SearchForm from "@components/search-form";
import Switch from "./ps-switch";
import { Banner } from "./Banner";
import IconButton from "./button-ps";

interface HeaderContentProps {
  title?: string;
  searchPlaceholder?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  onSearch?: (searchValue: string) => void;
}

const HeaderContent: React.FC<HeaderContentProps> = ({
  title,
  searchPlaceholder,
  buttonLabel,
  onButtonClick,
  onSearch,
}) => {
  return (
    <div className="sm:flex sm:justify-between sm:items-center mb-5">
      <div className="mb-4 sm:mb-0 ">
        {title && (
          <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
            {title} 🐾
          </h1>
        )}
      </div>

      <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        {searchPlaceholder && (
          <SearchForm
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            minLength={0}
          />
        )}

        {buttonLabel && onButtonClick && (
          <IconButton
            buttonLabel={buttonLabel}
            icon={
              <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
            }
            onButtonClick={onButtonClick}
          />
        )}
      </div>
    </div>
  );
};

export default HeaderContent;
