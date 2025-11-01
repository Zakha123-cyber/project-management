import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 w-full h-16 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-x-4">
          <MobileSidebar />
          <Logo />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-x-3">
          {/* Organization Switcher */}
          <div className="hidden sm:block">
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl="/organization/:id"
              afterLeaveOrganizationUrl="/select-org"
              afterSelectOrganizationUrl="/organization/:id"
              appearance={{
                elements: {
                  rootBox: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  organizationSwitcherTrigger: {
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  },
                },
              }}
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-neutral-200" />

          {/* User Button */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: {
                  height: 36,
                  width: 36,
                  borderRadius: "10px",
                },
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
};
