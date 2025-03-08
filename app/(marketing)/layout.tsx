import { SiteFooter } from "@/components/layout/site-footer";
import { NavBar } from "@/components/layout/navbar";
import { MarketingPopup } from "@/components/marketing-popup";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar scroll />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <MarketingPopup />
    </div>
  );
}
