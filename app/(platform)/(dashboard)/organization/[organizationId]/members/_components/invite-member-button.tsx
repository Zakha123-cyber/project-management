"use client";

import { useState } from "react";
import { useOrganization, OrganizationProfile } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const InviteMemberButton = () => {
  const { organization, membership } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  if (!organization) return null;

  // Check if user has permission to invite (must be admin)
  const canInvite = membership?.role === "org:admin";

  return (
    <>
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => {
          if (!canInvite) {
            toast.error("Hanya admin yang dapat mengundang member!");
            return;
          }
          setIsOpen(true);
        }}
        title={!canInvite ? "Hanya admin yang bisa mengundang member" : "Undang anggota baru"}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Undang Anggota
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Undang Anggota Baru</DialogTitle>
            <DialogDescription>Gunakan form di bawah untuk mengundang anggota baru ke organisasi.</DialogDescription>
          </DialogHeader>

          {!canInvite ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Akses Ditolak</p>
                <p className="text-xs text-red-700 mt-1">Hanya admin organisasi yang dapat mengundang member baru.</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  <strong>Catatan:</strong> Setelah user menerima undangan dan join, Anda perlu assign role dan divisi mereka di halaman members.
                </p>
              </div>

              {/* Clerk's built-in invitation UI */}
              <OrganizationProfile
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    cardBox: "shadow-none",
                  },
                }}
              >
                <OrganizationProfile.Page label="members" />
              </OrganizationProfile>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
