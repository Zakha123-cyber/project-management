import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { divisionId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const members = await db.member.findMany({
      where: {
        divisionId: params.divisionId,
        status: "ACTIVE",
      },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("[DIVISION_MEMBERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
