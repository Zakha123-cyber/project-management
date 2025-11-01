import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/**
 * CLERK WEBHOOK HANDLER
 *
 * CARA KONFIGURASI:
 * 1. Buka https://dashboard.clerk.com
 * 2. Pilih aplikasi Anda → Webhooks → Add Endpoint
 * 3. Masukkan URL:
 *    - Development (dengan ngrok): https://your-ngrok-url.ngrok.io/api/webhooks/clerk
 *    - Production: https://your-domain.com/api/webhooks/clerk
 * 4. Enable Events (PENTING - Enable SEMUA ini):
 *    ✓ organizationInvitation.accepted (user accept invite)
 *    ✓ organizationMembership.created (user join org)
 *    ✓ organizationMembership.deleted (user leave)
 *    ✓ user.updated (user update profile)
 * 5. Save → Copy Signing Secret → Paste ke .env sebagai CLERK_WEBHOOK_SECRET
 *
 * FLOW:
 * 1. Admin invite user via Clerk UI
 * 2. Event: organizationInvitation.created (logged, not processed)
 * 3. User accept invitation dari email
 * 4. Event: organizationInvitation.accepted (logged)
 * 5. Event: organizationMembership.created (CREATE MEMBER di DB)
 * 6. Admin assign role & divisi di halaman /members
 * 7. Status berubah jadi ACTIVE
 */

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log("\n" + "=".repeat(60));
  console.log("🔔 WEBHOOK REQUEST RECEIVED");
  console.log("=".repeat(60));

  if (!WEBHOOK_SECRET) {
    console.error("❌ CLERK_WEBHOOK_SECRET not found in .env!");
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  console.log("✅ Webhook secret found");

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log("📋 Headers:", {
    svix_id: svix_id ? "present" : "missing",
    svix_timestamp: svix_timestamp ? "present" : "missing",
    svix_signature: svix_signature ? "present" : "missing",
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing svix headers!");
    return new NextResponse("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  console.log("🔔 Webhook received:", eventType);
  console.log("📦 Full payload:", JSON.stringify(evt.data, null, 2));

  // Handle when invitation is accepted and user joins
  if (eventType === "organizationInvitation.accepted") {
    console.log("✉️ Invitation accepted - User joining organization...");

    try {
      // For accepted invitations, we get the user data differently
      const invitationData: any = evt.data;

      console.log("📋 Invitation data:", invitationData);

      // Extract user info from the accepted invitation
      const email = invitationData.email_address || "";

      // We need to wait for organizationMembership.created to get full user data
      // For now, just log that invitation was accepted
      console.log("✅ Invitation accepted for:", email);
      console.log("⏳ Waiting for organizationMembership.created event for full user data...");
    } catch (error) {
      console.error("❌ Error processing invitation acceptance:", error);
    }
  }

  if (eventType === "organizationMembership.created") {
    // User baru join organization (alternatif event)
    console.log("👤 Processing new member...");

    const { public_user_data } = evt.data;

    if (!public_user_data) {
      console.error("❌ No public_user_data in payload");
      return new NextResponse("No user data", { status: 400 });
    }

    const userId = public_user_data.user_id || "";
    const email = public_user_data.identifier || "";
    const firstName = public_user_data.first_name || "";
    const lastName = public_user_data.last_name || "";
    const imageUrl = public_user_data.image_url || "";

    console.log("📋 Extracted data:", { userId, email, firstName, lastName });

    try {
      // Cek apakah user sudah ada di database
      const existingMember = await db.member.findUnique({
        where: { userId },
      });

      if (existingMember) {
        console.log("ℹ️ Member already exists:", existingMember.email);
      } else {
        // Create new member dengan status PENDING
        const newMember = await db.member.create({
          data: {
            userId,
            email: email || `user_${userId}@temp.com`,
            name: `${firstName} ${lastName}`.trim() || "New Member",
            imageUrl: imageUrl || null,
            role: "STAFF", // Default role
            status: "PENDING", // Waiting for admin to assign division
          },
        });

        console.log(`✅ New member created successfully:`, newMember);
      }
    } catch (error) {
      console.error("❌ Error creating member:", error);
      return new NextResponse("Error creating member", { status: 500 });
    }
  }

  if (eventType === "organizationMembership.deleted") {
    // User keluar dari organization
    const { public_user_data } = evt.data;
    const userId = public_user_data?.user_id || "";

    if (!userId) {
      return new NextResponse("No user id", { status: 400 });
    }

    try {
      await db.member.update({
        where: { userId },
        data: { status: "INACTIVE" },
      });

      console.log(`✅ Member set to inactive: ${userId}`);
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  }

  if (eventType === "user.updated") {
    // User update profile
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      const existingMember = await db.member.findUnique({
        where: { userId: id },
      });

      if (existingMember) {
        await db.member.update({
          where: { userId: id },
          data: {
            email: email_addresses[0]?.email_address || existingMember.email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || existingMember.name,
            imageUrl: image_url || existingMember.imageUrl,
          },
        });

        console.log(`✅ Member updated: ${id}`);
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
  }

  return new NextResponse("Webhook processed", { status: 200 });
}
