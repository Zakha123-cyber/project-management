"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MemberRole, MemberStatus } from "@prisma/client";

interface UpdateMemberAssignmentParams {
  memberId: string;
  role: MemberRole;
  divisionId: string;
  status: MemberStatus;
}

export async function updateMemberAssignment(params: UpdateMemberAssignmentParams) {
  try {
    const { memberId, role, divisionId, status } = params;

    // Validasi divisi exists
    const divisionExists = await db.division.findUnique({
      where: { id: divisionId },
    });

    if (!divisionExists) {
      return { error: "Divisi tidak ditemukan" };
    }

    // Update member
    const updatedMember = await db.member.update({
      where: { id: memberId },
      data: {
        role,
        divisionId,
        status,
      },
    });

    revalidatePath("/organization/[organizationId]/members");

    return { data: updatedMember };
  } catch (error) {
    console.error("Error updating member:", error);
    return { error: "Gagal mengupdate member" };
  }
}
