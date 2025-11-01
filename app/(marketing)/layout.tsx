import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-gradient-to-br from-white via-[#9BD0FF]/5 to-[#0EA5E9]/10">
      <Navbar />
      <main className="pt-20 pb-20 min-h-screen flex items-center justify-center">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
