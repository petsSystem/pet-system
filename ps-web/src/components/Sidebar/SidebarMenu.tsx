import React from "react";

type Props = {
  pathname: string;
  children: React.ReactNode;
};

const SidebarMenu = ({ pathname, children }: Props) => {
  return <nav className="mt-2 py-4 px-4">{children}</nav>;
};

export default SidebarMenu;
