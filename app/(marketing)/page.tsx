import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, ClipboardCheck, ListTodo } from "lucide-react";
import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col px-4 md:px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="flex items-center justify-center flex-col text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9BD0FF]/20 to-[#0EA5E9]/20 border border-[#9BD0FF]/30 rounded-full backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#0EA5E9] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-neutral-700">Paseban Kawis Task Management System</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className={cn("text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight", textFont.className)}>
            PPK ORMAWA BEM FASILKOM
            <span className="block mt-2 bg-gradient-to-r from-[#9BD0FF] via-[#0EA5E9] to-[#0284C7] bg-clip-text text-transparent">PASEBAN KAWIS</span>
          </h1>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Button size="lg" className="bg-gradient-to-r from-[#9BD0FF] to-[#0EA5E9] hover:from-[#7CBFEF] hover:to-[#0C8FD9] text-white rounded-xl px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all group" asChild>
            <Link href="/sign-up" className="flex items-center gap-2">
              Mulai Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" className="border-2 border-neutral-300 hover:border-[#9BD0FF] hover:bg-[#9BD0FF]/5 rounded-xl px-8 py-6 text-base font-semibold transition-all" asChild>
            <Link href="/sign-in">Masuk ke Akun</Link>
          </Button>
        </div>

        {/* Features Icons */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 pt-12 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9BD0FF]/20 to-[#0EA5E9]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListTodo className="w-7 h-7 text-[#0EA5E9]" />
            </div>
            <span className="text-sm font-medium text-neutral-700">Kelola Jobdesk</span>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9BD0FF]/20 to-[#0EA5E9]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-[#0EA5E9]" />
            </div>
            <span className="text-sm font-medium text-neutral-700">Tim Terkoordinasi</span>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9BD0FF]/20 to-[#0EA5E9]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardCheck className="w-7 h-7 text-[#0EA5E9]" />
            </div>
            <span className="text-sm font-medium text-neutral-700">Penilaian Anggota</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
