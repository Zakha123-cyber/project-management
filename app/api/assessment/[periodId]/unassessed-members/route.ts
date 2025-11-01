import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

interface RouteParams {
  params: {
    periodId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { periodId } = params;

    // Get current member
    const currentMember = await db.member.findUnique({
      where: { userId },
    });

    if (!currentMember) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Get all active members except self
    const allMembers = await db.member.findMany({
      where: {
        status: "ACTIVE",
        userId: { not: userId }, // Exclude self
      },
      include: {
        division: true,
      },
      orderBy: [{ division: { name: "asc" } }, { name: "asc" }],
    });

    // Get assessments already submitted by this user in this period
    const submittedAssessments = await db.assessment.findMany({
      where: {
        periodId,
        assessorId: userId,
      },
      select: {
        assesseeId: true,
      },
    });

    const assessedUserIds = new Set(submittedAssessments.map((a: any) => a.assesseeId));

    // Filter out already assessed members
    const unassessedMembers = allMembers.filter((member) => !assessedUserIds.has(member.userId));

    return NextResponse.json({
      total: allMembers.length,
      assessed: assessedUserIds.size,
      remaining: unassessedMembers.length,
      members: unassessedMembers,
    });
  } catch (error) {
    console.error("[UNASSESSED_MEMBERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
