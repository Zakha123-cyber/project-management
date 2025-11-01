import { db } from "@/lib/db";
import { MemberCard } from "./member-card";
import { UserPlus } from "lucide-react";

export const MembersList = async () => {
  const members = await db.member.findMany({
    include: {
      division: true,
    },
    orderBy: [{ status: "asc" }, { role: "asc" }, { createdAt: "desc" }],
  });

  const divisions = await db.division.findMany({
    orderBy: { name: "asc" },
  });

  // Debug logging
  console.log("📊 Members fetched from database:", members.length);
  console.log("📋 Members data:", JSON.stringify(members, null, 2));

  // Group members by status
  const pendingMembers = members.filter((m) => m.status === "PENDING");
  const activeMembers = members.filter((m) => m.status === "ACTIVE");
  const inactiveMembers = members.filter((m) => m.status === "INACTIVE");

  console.log("🟡 Pending members:", pendingMembers.length);
  console.log("🟢 Active members:", activeMembers.length);
  console.log("⚪ Inactive members:", inactiveMembers.length);

  return (
    <div className="space-y-8">
      {/* Pending Members */}
      {pendingMembers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <h2 className="text-lg font-semibold text-neutral-700">Menunggu Assignment ({pendingMembers.length})</h2>
          </div>
          <p className="text-sm text-neutral-600 mb-4">Anggota baru yang belum di-assign role dan divisi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMembers.map((member) => (
              <MemberCard key={member.id} member={member} divisions={divisions} />
            ))}
          </div>
        </div>
      )}

      {/* Active Members */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <h2 className="text-lg font-semibold text-neutral-700">Anggota Aktif ({activeMembers.length})</h2>
        </div>
        {activeMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <UserPlus className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">Belum ada anggota aktif</p>
            <p className="text-sm text-gray-400">Undang anggota untuk memulai</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMembers.map((member) => (
              <MemberCard key={member.id} member={member} divisions={divisions} />
            ))}
          </div>
        )}
      </div>

      {/* Inactive Members */}
      {inactiveMembers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <h2 className="text-lg font-semibold text-neutral-700">Anggota Tidak Aktif ({inactiveMembers.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveMembers.map((member) => (
              <MemberCard key={member.id} member={member} divisions={divisions} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
