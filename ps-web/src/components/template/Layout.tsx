import { MenuPS } from "./Menu";
import { HeaderPS } from "./Header";
import { ContentPS } from "./Content";
import { Breadcrumb, BreadcrumbItem } from "@components/Breadcrumb";
import { Banner } from "@components/Banner";

interface LayoutProps {
  title?: string;
  subTitle: string;
  children?: React.ReactNode;
  menu?: string;
  banner?: {
    open: boolean;
    setOpen?: (open: boolean) => void;
    message: string;
  };
}

export function LayoutPS({
  title,
  subTitle,
  children,
  menu,
  banner,
}: LayoutProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: menu ?? "", href: "/" },
  ];
  return (
    <div className={`flex h-screen w-screen bg-gray-200 relative`}>
      <MenuPS title="Menu lateral" subTitle="itens do menu" />
      <div className="flex flex-col w-full bg-gray-200">
        <HeaderPS title={title} subTitle={subTitle} />
        <ContentPS>
          {!!title && (
            <div className="flex ml-auto justify-end mr-20 mb-5">
              {banner && (
                <div className="m-auto">
                  <Banner type="warning" open={Boolean(banner.open)}>
                    {banner.message}
                  </Banner>
                </div>
              )}
            </div>
          )}
          {children}
        </ContentPS>
      </div>
    </div>
  );
}
