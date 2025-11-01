import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/**
 * API Endpoint untuk sync members dari Clerk Organization ke Database
 * 
 * GET /api/sync-members
 * 
 * Flow:
 * 1. Get current user's organization dari Clerk
 * 2. Fetch semua members dari organization tersebut
 * 3. Sync ke database dengan status PENDING
 * 4. Return summary
 */

export async function GET() {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("🔄 SYNC MEMBERS FROM CLERK");
    console.log("=".repeat(60));

    // Get current user's auth
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      console.error("❌ No user or organization found");
      return NextResponse.json(
        { error: "Unauthorized - No organization found" },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", userId);
    console.log("✅ Organization ID:", orgId);

    // Fetch organization members dari Clerk
    console.log("\n📥 Fetching members from Clerk...");
    
    const organizationMemberships = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    console.log(`✅ Found ${organizationMemberships.length} members in Clerk`);

    if (organizationMemberships.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No members found in organization",
        synced: 0,
        skipped: 0,
      });
    }

    let syncedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    // Process each member
    for (const membership of organizationMemberships) {
      try {
        const publicUserData = membership.publicUserData;
        
        if (!publicUserData) {
          console.warn("⚠️ No public user data for membership:", membership.id);
          skippedCount++;
          continue;
        }

        const clerkUserId = publicUserData.userId;
        const email = publicUserData.identifier || "";
        const firstName = publicUserData.firstName || "";
        const lastName = publicUserData.lastName || "";
        const imageUrl = publicUserData.imageUrl || "";

        console.log(`\n👤 Processing: ${firstName} ${lastName} (${email})`);

        // Check if member already exists
        const existingMember = await db.member.findUnique({
          where: { userId: clerkUserId },
        });

        if (existingMember) {
          console.log(`   ℹ️  Already exists - updating data`);
          
          // Update existing member data
          await db.member.update({
            where: { userId: clerkUserId },
            data: {
              email: email || existingMember.email,
              name: `${firstName} ${lastName}`.trim() || existingMember.name,
              imageUrl: imageUrl || existingMember.imageUrl,
            },
          });
          
          skippedCount++;
        } else {
          console.log(`   ✨ New member - creating...`);
          
          // Create new member
          await db.member.create({
            data: {
              userId: clerkUserId,
              email: email || `user_${clerkUserId}@temp.com`,
              name: `${firstName} ${lastName}`.trim() || "New Member",
              imageUrl: imageUrl || null,
              role: "STAFF",
              status: "PENDING",
            },
          });
          
          console.log(`   ✅ Created successfully`);
          syncedCount++;
        }
      } catch (memberError: any) {
        console.error(`   ❌ Error processing member:`, memberError.message);
        errors.push(memberError.message);
        skippedCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 SYNC SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ New members synced: ${syncedCount}`);
    console.log(`ℹ️  Existing members: ${skippedCount}`);
    if (errors.length > 0) {
      console.log(`❌ Errors: ${errors.length}`);
      errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
    }
    console.log("=".repeat(60) + "\n");

    return NextResponse.json({
      success: true,
      message: "Members synced successfully",
      synced: syncedCount,
      existing: skippedCount,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error("❌ Fatal error syncing members:", error);
    return NextResponse.json(
      { 
        error: "Failed to sync members", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
