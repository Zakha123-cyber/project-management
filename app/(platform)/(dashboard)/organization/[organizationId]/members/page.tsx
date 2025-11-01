import { Separator } from "@/components/ui/separator";
import { MembersList } from "./_components/members-list";
import { InviteMemberButton } from "./_components/invite-member-button";
import { SyncMembersButton } from "./_components/sync-members-button";
import { Users } from "lucide-react";

const MembersPage = async () => {
  return (
    <div className="w-full mb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-neutral-700" />
            <h1 className="text-2xl font-bold text-neutral-700">Manajemen Anggota</h1>
          </div>
          <p className="text-sm text-neutral-600">Kelola anggota tim dan assign role untuk setiap divisi</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncMembersButton />
          <InviteMemberButton />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Members List */}
      <div className="px-2 md:px-4">
        <MembersList />
      </div>
    </div>
  );
};

export default MembersPage;
