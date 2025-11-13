import React from "react";
import Link from "next/link";

import Image from "next/image";

const SidebarHeader = () => {
  return (
    <div className="flex items-center justify-center pt-4">
      <Link href="/" className="flex justify-center ">
        <Image
          src="/paw_two.svg"
          alt="Logo"
          width={24}
          height={24}
          className="w-24 lg:w-24 lg:h-24"
        />
      </Link>
    </div>
  );
};

export default SidebarHeader;
