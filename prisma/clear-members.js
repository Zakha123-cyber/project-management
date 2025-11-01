const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Menghapus semua data member dummy...");

  try {
    // Hapus semua member
    const deletedMembers = await prisma.member.deleteMany({});
    console.log(`✅ Berhasil menghapus ${deletedMembers.count} member`);

    console.log("\n📊 Status database:");
    const remainingMembers = await prisma.member.count();
    console.log(`   Members: ${remainingMembers}`);

    const divisions = await prisma.division.count();
    console.log(`   Divisions: ${divisions}`);

    const tasks = await prisma.task.count();
    console.log(`   Tasks: ${tasks}`);

    console.log("\n✨ Database member sudah bersih!");
    console.log("💡 Sekarang invite user via Clerk untuk test webhook\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
