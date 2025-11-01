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

    // Check if user is from BPI division
    const member = await db.member.findUnique({
      where: { userId },
      include: { division: true },
    });

    if (!member || member.division?.name !== "BPI (Badan Pengurus Inti)") {
      return new NextResponse("Forbidden - BPI only", { status: 403 });
    }

    const { periodId } = params;

    // Get all assessments for this period
    const assessments = await db.assessment.findMany({
      where: {
        periodId,
      },
      include: {
        assesseeDivision: true,
      },
    });

    // Group assessments by assessee (yang dinilai)
    const assessmentsByAssessee = assessments.reduce((acc: any, assessment) => {
      if (!acc[assessment.assesseeId]) {
        acc[assessment.assesseeId] = {
          userId: assessment.assesseeId,
          name: assessment.assesseeName,
          division: assessment.assesseeDivision,
          assessments: [],
        };
      }
      acc[assessment.assesseeId].assessments.push(assessment);
      return acc;
    }, {});

    // Calculate averages for each member
    const results = Object.values(assessmentsByAssessee).map((member: any) => {
      const assessments = member.assessments;
      const count = assessments.length;

      if (count === 0) {
        return {
          ...member,
          assessmentCount: 0,
          averageHardSkill: 0,
          averageSoftSkill: 0,
          averageTotal: 0,
          hardSkillsDetail: [],
          softSkillsDetail: [],
        };
      }

      // Calculate averages
      const totalHardSkill = assessments.reduce((sum: number, a: any) => sum + a.averageHardSkill, 0);
      const totalSoftSkill = assessments.reduce((sum: number, a: any) => sum + a.averageSoftSkill, 0);
      const totalOverall = assessments.reduce((sum: number, a: any) => sum + a.averageTotal, 0);

      // Calculate detail for each hard skill indicator (7 indicators)
      const hardSkillsDetail = [];
      for (let i = 1; i <= 7; i++) {
        const key = `hardSkill${i}`;
        const total = assessments.reduce((sum: number, a: any) => sum + a[key], 0);
        hardSkillsDetail.push({
          index: i,
          average: total / count,
        });
      }

      // Calculate detail for each soft skill indicator (12 indicators)
      const softSkillsDetail = [];
      for (let i = 1; i <= 12; i++) {
        const key = `softSkill${i}`;
        const total = assessments.reduce((sum: number, a: any) => sum + a[key], 0);
        softSkillsDetail.push({
          index: i,
          average: total / count,
        });
      }

      return {
        userId: member.userId,
        name: member.name,
        division: member.division,
        assessmentCount: count,
        averageHardSkill: totalHardSkill / count,
        averageSoftSkill: totalSoftSkill / count,
        averageTotal: totalOverall / count,
        hardSkillsDetail,
        softSkillsDetail,
      };
    });

    // Sort by average total (descending)
    results.sort((a: any, b: any) => b.averageTotal - a.averageTotal);

    // Get all divisions
    const divisions = await db.division.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Calculate statistics
    const stats = {
      totalMembers: results.length,
      totalAssessments: assessments.length,
      averageScore: results.length > 0 ? results.reduce((sum: number, r: any) => sum + r.averageTotal, 0) / results.length : 0,
      highestScore: results.length > 0 ? Math.max(...results.map((r: any) => r.averageTotal)) : 0,
    };

    return NextResponse.json({
      results,
      divisions,
      stats,
    });
  } catch (error) {
    console.error("[ASSESSMENT_RESULTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
