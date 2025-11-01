"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { updateMemberAssignment } from "@/actions/update-member-assignment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AssignRoleDialogProps {
  member: any;
  divisions: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const AssignRoleDialog = ({ member, divisions, isOpen, onClose }: AssignRoleDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(member.role || "STAFF");
  const [selectedDivision, setSelectedDivision] = useState(member.divisionId || "");

  const handleSubmit = () => {
    if (!selectedDivision) {
      toast.error("Pilih divisi terlebih dahulu!");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateMemberAssignment({
          memberId: member.id,
          role: selectedRole,
          divisionId: selectedDivision,
          status: "ACTIVE",
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Member berhasil di-assign!");
          router.refresh();
          onClose();
        }
      } catch (error) {
        toast.error("Terjadi kesalahan!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Role & Divisi</DialogTitle>
          <DialogDescription>Pilih role dan divisi untuk {member.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full p-2 border rounded-md" disabled={isPending}>
              <option value="ADMIN">Admin - Ketua Pelaksana (Full Access)</option>
              <option value="COORDINATOR">Coordinator - CO Divisi</option>
              <option value="STAFF">Staff - Anggota Divisi</option>
            </select>
            <p className="text-xs text-gray-500">
              {selectedRole === "ADMIN" && "Full access ke semua divisi dan management"}
              {selectedRole === "COORDINATOR" && "Manage tasks dan anggota di 1 divisi"}
              {selectedRole === "STAFF" && "View all divisi, edit tasks di divisi sendiri"}
            </p>
          </div>

          {/* Division Selection */}
          <div className="space-y-2">
            <Label htmlFor="division">Divisi</Label>
            <select id="division" value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="w-full p-2 border rounded-md" disabled={isPending}>
              <option value="">Pilih Divisi</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-800">
              <strong>Catatan:</strong> Setiap divisi harus memiliki minimal 1 Coordinator. Admin (Ketua Pelaksana) dapat diassign ke divisi BPI.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !selectedDivision}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
