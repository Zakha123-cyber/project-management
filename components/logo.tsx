import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center hidden md:flex">
        <Image src="/logo-paseban-kawis.png" alt="Logo" height={50} width={50} />
      </div>
    </Link>
  );
};
