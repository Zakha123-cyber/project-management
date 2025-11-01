import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Test endpoint untuk manual create member
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🧪 Manual test - Creating member:", body);

    const member = await db.member.create({
      data: {
        userId: body.userId || `test_${Date.now()}`,
        email: body.email || `test${Date.now()}@example.com`,
        name: body.name || "Test User",
        imageUrl: body.imageUrl || null,
        role: "STAFF",
        status: "PENDING",
      },
    });

    console.log("✅ Member created:", member);

    return NextResponse.json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (error: any) {
    console.error("❌ Error creating member:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint untuk test database connection
export async function GET() {
  try {
    const members = await db.member.findMany();
    const count = await db.member.count();

    return NextResponse.json({
      success: true,
      count,
      members,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
