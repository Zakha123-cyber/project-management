"use client";

import { useState } from "react";
import { Member, Division } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Users, Settings, CheckCircle2, Clock, XCircle } from "lucide-react";
import { AssignRoleDialog } from "./assign-role-dialog";

interface MemberCardProps {
  member: Member & { division: Division | null };
  divisions: Division[];
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case "ADMIN":
      return <Badge className="bg-red-500">Admin</Badge>;
    case "COORDINATOR":
      return <Badge className="bg-blue-500">Coordinator</Badge>;
    default:
      return <Badge className="bg-gray-500">Staff</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-medium">Aktif</span>
        </div>
      );
    case "PENDING":
      return (
        <div className="flex items-center gap-1 text-yellow-600">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium">Pending</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1 text-gray-600">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Tidak Aktif</span>
        </div>
      );
  }
};

export const MemberCard = ({ member, divisions }: MemberCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">{member.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                {member.email}
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Role:</span>
            </div>
            {getRoleBadge(member.role)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Divisi:</span>
            </div>
            {member.division ? (
              <Badge variant="outline" className={member.division.color + " text-white border-none"}>
                {member.division.name}
              </Badge>
            ) : (
              <span className="text-xs text-gray-400 italic">Belum di-assign</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            {getStatusBadge(member.status)}
          </div>
        </div>

        {/* Actions */}
        {member.status === "PENDING" && (
          <Button size="sm" variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Assign Role & Divisi
          </Button>
        )}

        {member.status === "ACTIVE" && (
          <Button size="sm" variant="ghost" className="w-full" onClick={() => setIsDialogOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Edit Assignment
          </Button>
        )}
      </div>

      <AssignRoleDialog member={member} divisions={divisions} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
};
