import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const Logo = () => {
    return(
        <Link href="/">
            <div className="hover:opacity-75 transition items-center hidden md:flex">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    height={150}
                    width={150}
                />
            </div>
        </Link>
    );
};