import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all assessment periods, ordered by most recent
    const periods = await db.assessmentPeriod.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            assessments: true,
          },
        },
      },
    });

    return NextResponse.json(periods);
  } catch (error) {
    console.error("[PERIODS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
