"use client";

import { useRouter, usePathname } from "next/navigation";
import { Layout, ClipboardCheck, Users, ListTodo } from "lucide-react";

import { cn } from "@/lib/utils";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = ({ isExpanded, isActive, organization, onExpand }: NavItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Jobdesk",
      icon: <ListTodo className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/tasks`,
    },
    {
      label: "Anggota",
      icon: <Users className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/members`,
    },
    {
      label: "Penilaian Anggota",
      icon: <ClipboardCheck className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/penilaian`,
    },
  ];

  const onClick = (href: string) => {
    router.push(href);
  };

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn("flex items-center gap-x-3 p-2 text-neutral-700 rounded-lg hover:bg-neutral-100 transition text-start no-underline hover:no-underline", isActive && !isExpanded && "bg-[#9BD0FF]/20 text-[#0EA5E9] font-medium")}
      >
        <div className="flex items-center gap-x-3">
          <div className="w-8 h-8 relative rounded-lg overflow-hidden ring-2 ring-neutral-200">
            <Image fill src={organization.imageUrl} alt="Organization" className="object-cover" />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-1 text-neutral-700">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            onClick={() => onClick(route.href)}
            className={cn("w-full font-normal justify-start pl-10 mb-1 rounded-lg hover:bg-neutral-100 transition-colors", pathname === route.href && "bg-[#9BD0FF]/30 text-[#0EA5E9] font-medium hover:bg-[#9BD0FF]/40")}
            variant="ghost"
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
