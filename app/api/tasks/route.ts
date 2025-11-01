import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get member info for permission check
    const member = await db.member.findUnique({
      where: { userId },
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const divisionId = searchParams.get("divisionId");

    // Build where clause based on role
    let whereClause: any = {};

    // If filtering by division
    if (divisionId && divisionId !== "all") {
      whereClause.divisionId = divisionId;
    }

    // COORDINATOR can only see tasks from their division
    if (member.role === "COORDINATOR" && member.divisionId) {
      whereClause.divisionId = member.divisionId;
    }

    // Fetch tasks with division info
    const tasks = await db.task.findMany({
      where: whereClause,
      include: {
        division: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[TASKS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
