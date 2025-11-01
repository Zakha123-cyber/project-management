import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-16 px-4 md:px-6 border-b border-neutral-200/50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 flex items-center z-50">
      <div className="max-w-7xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="flex items-center gap-x-3">
          <Button size="sm" variant="ghost" className="hover:bg-neutral-100 rounded-lg" asChild>
            <Link href="/sign-in">Masuk</Link>
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-[#9BD0FF] to-[#0EA5E9] hover:from-[#7CBFEF] hover:to-[#0C8FD9] text-white rounded-lg shadow-md hover:shadow-lg transition-all" asChild>
            <Link href="/sign-up">Mulai Sekarang</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
