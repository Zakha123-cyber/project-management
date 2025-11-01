const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkMembers() {
  console.log("🔍 Checking members in database...\n");

  try {
    const members = await prisma.member.findMany({
      include: {
        division: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`📊 Total members: ${members.length}\n`);

    if (members.length === 0) {
      console.log("❌ No members found in database!");
      console.log("\n💡 Possible issues:");
      console.log("   1. Webhook belum dipanggil");
      console.log("   2. Webhook error (cek log terminal Next.js)");
      console.log("   3. Database connection issue");
      console.log("\n🔧 Next steps:");
      console.log("   1. Invite user via Clerk");
      console.log("   2. Check terminal Next.js for webhook logs:");
      console.log("      🔔 Webhook received: organizationMembership.created");
      console.log("      ✅ New member created successfully");
      console.log("   3. Run this script again: node prisma/check-members.js\n");
    } else {
      console.log("✅ Members found:\n");
      members.forEach((member, index) => {
        console.log(`${index + 1}. ${member.name || "Unnamed"}`);
        console.log(`   Email: ${member.email}`);
        console.log(`   User ID: ${member.userId}`);
        console.log(`   Role: ${member.role}`);
        console.log(`   Status: ${member.status}`);
        console.log(`   Division: ${member.division?.name || "Not assigned"}`);
        console.log(`   Created: ${member.createdAt}`);
        console.log("");
      });

      // Group by status
      const pending = members.filter((m) => m.status === "PENDING");
      const active = members.filter((m) => m.status === "ACTIVE");
      const inactive = members.filter((m) => m.status === "INACTIVE");

      console.log("📈 Status breakdown:");
      console.log(`   🟡 PENDING: ${pending.length}`);
      console.log(`   🟢 ACTIVE: ${active.length}`);
      console.log(`   ⚪ INACTIVE: ${inactive.length}\n`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMembers();
