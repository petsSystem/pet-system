import React, { useState } from "react";

export default function SearchForm({
  placeholder = "Pesquisar...",
  onSearch,
  minLength = 3,
}: {
  placeholder?: string;
  onSearch?: (searchValue: string) => void;
  minLength?: number;
}) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSearchValue(newValue);
    if (onSearch && newValue.length >= minLength) {
      onSearch(newValue);
    }
  };

  return (
    <form className="relative" onSubmit={handleSearch}>
      <label htmlFor="action-search" className="sr-only">
        Pesquisar
      </label>
      <input
        id="action-search"
        className="form-input pl-9 bg-white focus:outline-none"
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
      />
      <button
        className="absolute inset-0 right-auto group"
        type="submit"
        aria-label="Pesquisar"
      >
        <svg
          className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 mr-2"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
          <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
        </svg>
      </button>
    </form>
  );
}
