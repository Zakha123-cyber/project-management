const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Simulate webhook data from Clerk
const testUserData = {
  userId: "user_2h8op3Isl1QR7tKu5FGNfaLKEoU",
  email: "jane.doe@acme.com",
  firstName: "Jane",
  lastName: "Doe",
  imageUrl: "https://img.clerk.com/yyyyy",
};

async function createTestMember() {
  console.log("🧪 Creating test member from Clerk webhook data...\n");

  try {
    // Check if already exists
    const existing = await prisma.member.findUnique({
      where: { userId: testUserData.userId },
    });

    if (existing) {
      console.log("❌ Member already exists!");
      console.log("   Email:", existing.email);
      console.log("\n💡 Delete first with: node prisma/clear-members.js\n");
      return;
    }

    // Create member
    const member = await prisma.member.create({
      data: {
        userId: testUserData.userId,
        email: testUserData.email,
        name: `${testUserData.firstName} ${testUserData.lastName}`,
        imageUrl: testUserData.imageUrl,
        role: "STAFF",
        status: "PENDING",
      },
    });

    console.log("✅ Test member created successfully!\n");
    console.log("📋 Member data:");
    console.log("   ID:", member.id);
    console.log("   Name:", member.name);
    console.log("   Email:", member.email);
    console.log("   User ID:", member.userId);
    console.log("   Role:", member.role);
    console.log("   Status:", member.status);
    console.log("   Created:", member.createdAt);

    console.log("\n🎯 NEXT STEPS:");
    console.log("1. Buka halaman Members:");
    console.log("   http://localhost:3000/organization/org_34rpt192kzjEqhFSKaW5mmffPlA/members");
    console.log("\n2. Refresh halaman (F5 atau Ctrl+R)");
    console.log("\n3. Cek apakah member 'Jane Doe' muncul di 'Menunggu Assignment'");
    console.log("\n4. Jika MUNCUL:");
    console.log("   ✅ Frontend works! Masalah di webhook");
    console.log("   → Perlu fix webhook connection/configuration");
    console.log("\n5. Jika TIDAK MUNCUL:");
    console.log("   ❌ Frontend error");
    console.log("   → Perlu fix members-list.tsx atau member-card.tsx\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestMember();
