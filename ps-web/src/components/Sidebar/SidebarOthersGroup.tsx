import React from "react";
import Link from "next/link";

type Props = { pathname: string; children: React.ReactNode };

const SidebarOthersGroup = ({ pathname, children }: Props) => {
  return (
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">OTHERS</h3>
      <ul className="mb-6 flex flex-col gap-1.5">{children}</ul>
    </div>
  );
};

export default SidebarOthersGroup;
