import { IconCalendar, IconHome } from "../icons";
import { ImgPS } from "../ImgPS";
import { MenuItem } from "./MenuItem";
import { LogoSVG } from "@components/LogoSVG";
import Sidebar from "@components/Sidebar";

interface LayoutProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
}

export function MenuPS({ title, subTitle, children }: LayoutProps) {
  return <Sidebar />;
}
