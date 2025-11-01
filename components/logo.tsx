import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-90 transition items-center gap-x-3 hidden md:flex group">
        <div className="relative">
          <Image src="/logo-paseban-kawis.png" alt="Logo" height={40} width={40} className="rounded-lg" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-neutral-800 group-hover:text-[#0EA5E9] transition">PPK ORMAWA</span>
          <span className="text-xs text-neutral-500 font-medium">Task Management</span>
        </div>
      </div>
    </Link>
  );
};
