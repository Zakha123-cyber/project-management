import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get active period
    const activePeriod = await db.assessmentPeriod.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activePeriod);
  } catch (error) {
    console.error("[ACTIVE_PERIOD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
