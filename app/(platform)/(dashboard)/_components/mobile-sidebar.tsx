"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMboileSidebar } from "@/hooks/use-mobile-sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const onOpen = useMboileSidebar((state) => state.onOpen);
    const onClose = useMboileSidebar((state) => state.onClose);
    const isOpen = useMboileSidebar((state) => state.isOpen);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden mr-2 hover:bg-neutral-100"
                variant="ghost"
                size="sm"
            >
                <Menu className="h-5 w-5 text-neutral-700"/>
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side="left"
                    className="p-2 pt-10 w-72"
                >
                    <Sidebar
                        storageKey="t-sidebar-mobile-state"
                    />
                </SheetContent>
            </Sheet>
        </>
    );
};