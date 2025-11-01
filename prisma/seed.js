const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const divisions = [
  {
    name: "BPI (Badan Pengurus Inti)",
    description: "Badan pengurus inti yang terdiri dari Ketua Pelaksana, Sekretaris, dan Bendahara",
    color: "bg-red-500",
  },
  {
    name: "Divisi Sosialisasi",
    description: "Bertanggung jawab atas publikasi dan sosialisasi program kerja",
    color: "bg-blue-500",
  },
  {
    name: "Divisi Logbook",
    description: "Mengelola dokumentasi dan pelaporan kegiatan",
    color: "bg-green-500",
  },
  {
    name: "Divisi Pemrograman",
    description: "Mengembangkan sistem dan aplikasi organisasi",
    color: "bg-purple-500",
  },
  {
    name: "Divisi Pembangunan",
    description: "Mengelola infrastruktur dan pengembangan fisik",
    color: "bg-orange-500",
  },
  {
    name: "Divisi PDD",
    description: "Pengembangan Sumber Daya dan Departemen",
    color: "bg-teal-500",
  },
];

const divisionQuestions = [
  { divisionName: "BPI (Badan Pengurus Inti)", questionNumber: 1, questionText: "Kepemimpinan dan pengambilan keputusan" },
  { divisionName: "BPI (Badan Pengurus Inti)", questionNumber: 2, questionText: "Koordinasi dan manajemen organisasi" },
  { divisionName: "Divisi Sosialisasi", questionNumber: 1, questionText: "Kreativitas dalam pembuatan konten" },
  { divisionName: "Divisi Sosialisasi", questionNumber: 2, questionText: "Efektivitas strategi publikasi" },
  { divisionName: "Divisi Logbook", questionNumber: 1, questionText: "Kelengkapan dokumentasi kegiatan" },
  { divisionName: "Divisi Logbook", questionNumber: 2, questionText: "Kerapihan dan detail dalam pencatatan" },
  { divisionName: "Divisi Pemrograman", questionNumber: 1, questionText: "Kualitas kode dan sistem yang dikembangkan" },
  { divisionName: "Divisi Pemrograman", questionNumber: 2, questionText: "Kemampuan problem solving teknis" },
  { divisionName: "Divisi Pembangunan", questionNumber: 1, questionText: "Perencanaan dan eksekusi proyek fisik" },
  { divisionName: "Divisi Pembangunan", questionNumber: 2, questionText: "Pengelolaan sumber daya dan anggaran" },
  { divisionName: "Divisi PDD", questionNumber: 1, questionText: "Efektivitas program pengembangan SDM" },
  { divisionName: "Divisi PDD", questionNumber: 2, questionText: "Kemampuan memotivasi dan membimbing" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Bersihkan data lama
  console.log("🗑️  Clearing existing data...");
  await prisma.member.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.divisionQuestion.deleteMany();
  await prisma.assessmentPeriod.deleteMany();
  await prisma.division.deleteMany();
  console.log("✅ Cleared existing data");

  // Seed Divisions
  console.log("📁 Creating divisions...");
  const createdDivisions = await Promise.all(divisions.map((division) => prisma.division.create({ data: division })));
  console.log(`✅ Created ${createdDivisions.length} divisions`);

  // Seed Division Questions
  console.log("❓ Creating division-specific questions...");
  await Promise.all(divisionQuestions.map((question) => prisma.divisionQuestion.create({ data: question })));
  console.log(`✅ Created ${divisionQuestions.length} questions`);

  // Seed Tasks
  console.log("📝 Creating tasks...");
  const tasks = [
    // BPI
    {
      divisionName: "BPI (Badan Pengurus Inti)",
      title: "Rapat koordinasi bulanan",
      description: "Rapat rutin bulanan untuk koordinasi program kerja",
      deadline: new Date("2025-11-29"),
      status: "NOT_STARTED",
      priority: "HIGH",
      progress: 0,
      createdBy: "user_ketua_1",
      createdByName: "Budi Santoso",
    },
    {
      divisionName: "BPI (Badan Pengurus Inti)",
      title: "Evaluasi program kerja",
      description: "Evaluasi pelaksanaan program kerja periode berjalan",
      deadline: new Date("2025-12-05"),
      status: "NOT_STARTED",
      priority: "HIGH",
      progress: 0,
      createdBy: "user_ketua_1",
      createdByName: "Budi Santoso",
    },
    {
      divisionName: "BPI (Badan Pengurus Inti)",
      title: "Laporan keuangan bulanan",
      description: "Penyusunan dan submit laporan keuangan bulan November",
      deadline: new Date("2025-12-02"),
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 50,
      createdBy: "user_bendahara_1",
      createdByName: "Ahmad Rizki",
      assignedTo: "user_bendahara_1",
      assignedToName: "Ahmad Rizki",
    },

    // Divisi Sosialisasi
    {
      divisionName: "Divisi Sosialisasi",
      title: "Pembuatan konten media sosial",
      description: "Membuat konten untuk Instagram dan Facebook periode November",
      deadline: new Date("2025-11-30"),
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 60,
      createdBy: "user_co_sos_1",
      createdByName: "Dewi Lestari",
      assignedTo: "user_staff_sos_1",
      assignedToName: "Eko Prasetyo",
    },
    {
      divisionName: "Divisi Sosialisasi",
      title: "Desain poster kegiatan",
      description: "Desain poster untuk event akhir bulan",
      deadline: new Date("2025-11-05"),
      status: "NOT_STARTED",
      priority: "MEDIUM",
      progress: 0,
      createdBy: "user_co_sos_1",
      createdByName: "Dewi Lestari",
    },
    {
      divisionName: "Divisi Sosialisasi",
      title: "Koordinasi dengan media kampus",
      description: "Meeting dengan media kampus untuk liputan kegiatan",
      deadline: new Date("2025-10-28"),
      status: "OVERDUE",
      priority: "HIGH",
      progress: 0,
      createdBy: "user_co_sos_1",
      createdByName: "Dewi Lestari",
    },

    // Divisi Logbook
    {
      divisionName: "Divisi Logbook",
      title: "Update logbook mingguan",
      description: "Update dokumentasi kegiatan minggu ini",
      deadline: new Date("2025-11-27"),
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 70,
      createdBy: "user_co_log_1",
      createdByName: "Gunawan Wijaya",
      assignedTo: "user_staff_log_1",
      assignedToName: "Hana Kartika",
    },
    {
      divisionName: "Divisi Logbook",
      title: "Kompilasi dokumentasi November",
      description: "Mengkompilasi semua dokumentasi bulan November",
      deadline: new Date("2025-12-01"),
      status: "NOT_STARTED",
      priority: "MEDIUM",
      progress: 0,
      createdBy: "user_co_log_1",
      createdByName: "Gunawan Wijaya",
    },
    {
      divisionName: "Divisi Logbook",
      title: "Laporan kegiatan bulan lalu",
      description: "Laporan lengkap kegiatan Oktober 2025",
      deadline: new Date("2025-10-25"),
      status: "COMPLETED",
      priority: "LOW",
      progress: 100,
      createdBy: "user_co_log_1",
      createdByName: "Gunawan Wijaya",
      assignedTo: "user_staff_log_1",
      assignedToName: "Hana Kartika",
    },

    // Divisi Pemrograman
    {
      divisionName: "Divisi Pemrograman",
      title: "Development website manajemen",
      description: "Develop fitur manajemen jobdesk dan penilaian",
      deadline: new Date("2025-11-10"),
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 75,
      createdBy: "user_co_prog_1",
      createdByName: "Irfan Hakim",
      assignedTo: "user_staff_prog_1",
      assignedToName: "Joko Widodo",
    },
    {
      divisionName: "Divisi Pemrograman",
      title: "Testing fitur dashboard",
      description: "Testing dan bug fixing fitur dashboard",
      deadline: new Date("2025-11-03"),
      status: "NOT_STARTED",
      priority: "MEDIUM",
      progress: 0,
      createdBy: "user_co_prog_1",
      createdByName: "Irfan Hakim",
    },
    {
      divisionName: "Divisi Pemrograman",
      title: "Maintenance sistem database",
      description: "Backup dan maintenance database production",
      deadline: new Date("2025-11-29"),
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 40,
      createdBy: "user_co_prog_1",
      createdByName: "Irfan Hakim",
      assignedTo: "user_staff_prog_2",
      assignedToName: "Kartika Sari",
    },

    // Divisi Pembangunan
    {
      divisionName: "Divisi Pembangunan",
      title: "Renovasi ruang sekretariat",
      description: "Perencanaan dan eksekusi renovasi ruang sekre",
      deadline: new Date("2025-11-15"),
      status: "NOT_STARTED",
      priority: "MEDIUM",
      progress: 0,
      createdBy: "user_co_pemb_1",
      createdByName: "Lukman Hakim",
    },
    {
      divisionName: "Divisi Pembangunan",
      title: "Pengadaan peralatan kantor",
      description: "Procurement peralatan kantor untuk sekretariat",
      deadline: new Date("2025-11-08"),
      status: "IN_PROGRESS",
      priority: "LOW",
      progress: 30,
      createdBy: "user_co_pemb_1",
      createdByName: "Lukman Hakim",
      assignedTo: "user_staff_pemb_1",
      assignedToName: "Maya Puspita",
    },
    {
      divisionName: "Divisi Pembangunan",
      title: "Survey lokasi kegiatan",
      description: "Survey dan evaluasi lokasi untuk event akhir tahun",
      deadline: new Date("2025-11-30"),
      status: "NOT_STARTED",
      priority: "MEDIUM",
      progress: 0,
      createdBy: "user_co_pemb_1",
      createdByName: "Lukman Hakim",
    },

    // Divisi PDD
    {
      divisionName: "Divisi PDD",
      title: "Pelatihan leadership anggota",
      description: "Workshop leadership untuk semua anggota aktif",
      deadline: new Date("2025-11-12"),
      status: "NOT_STARTED",
      priority: "HIGH",
      progress: 0,
      createdBy: "user_co_pdd_1",
      createdByName: "Nurul Hidayah",
    },
    {
      divisionName: "Divisi PDD",
      title: "Evaluasi kinerja divisi",
      description: "Evaluasi kinerja semua divisi periode Q4",
      deadline: new Date("2025-12-01"),
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      progress: 25,
      createdBy: "user_co_pdd_1",
      createdByName: "Nurul Hidayah",
      assignedTo: "user_staff_pdd_1",
      assignedToName: "Omar Abdullah",
    },
    {
      divisionName: "Divisi PDD",
      title: "Workshop skill development",
      description: "Workshop pengembangan soft skill dan hard skill",
      deadline: new Date("2025-11-20"),
      status: "NOT_STARTED",
      priority: "LOW",
      progress: 0,
      createdBy: "user_co_pdd_1",
      createdByName: "Nurul Hidayah",
    },
  ];

  for (const task of tasks) {
    const division = createdDivisions.find((d) => d.name === task.divisionName);
    if (division) {
      await prisma.task.create({
        data: {
          divisionId: division.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          status: task.status,
          priority: task.priority,
          progress: task.progress,
          createdBy: task.createdBy,
          createdByName: task.createdByName,
          assignedTo: task.assignedTo || null,
          assignedToName: task.assignedToName || null,
        },
      });
    }
  }
  console.log(`✅ Created ${tasks.length} tasks`);

  // Seed Assessment Period
  console.log("📅 Creating assessment period...");
  const period = await prisma.assessmentPeriod.create({
    data: {
      name: "November 2025",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2025-11-30"),
      isActive: true,
    },
  });
  console.log(`✅ Created assessment period: ${period.name}`);

  // Seed Dummy Members
  console.log("👥 Creating dummy members...");
  const dummyMembers = [
    // BPI - ADMIN (Ketua)
    { userId: "user_ketua_1", email: "ketua@ppkormawa.id", name: "Budi Santoso", divisionName: "BPI (Badan Pengurus Inti)", role: "ADMIN", status: "ACTIVE" },
    // BPI - COORDINATOR (Sekretaris & Bendahara)
    { userId: "user_sekretaris_1", email: "sekretaris@ppkormawa.id", name: "Siti Nurhaliza", divisionName: "BPI (Badan Pengurus Inti)", role: "COORDINATOR", status: "ACTIVE" },
    { userId: "user_bendahara_1", email: "bendahara@ppkormawa.id", name: "Ahmad Rizki", divisionName: "BPI (Badan Pengurus Inti)", role: "COORDINATOR", status: "ACTIVE" },

    // Divisi Sosialisasi
    { userId: "user_co_sos_1", email: "co.sosialisasi@ppkormawa.id", name: "Dewi Lestari", divisionName: "Divisi Sosialisasi", role: "COORDINATOR", status: "ACTIVE" },
    { userId: "user_staff_sos_1", email: "staff1.sosialisasi@ppkormawa.id", name: "Eko Prasetyo", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" },
    { userId: "user_staff_sos_2", email: "staff2.sosialisasi@ppkormawa.id", name: "Fitri Amelia", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" },

    // Divisi Logbook
    { userId: "user_co_log_1", email: "co.logbook@ppkormawa.id", name: "Gunawan Wijaya", divisionName: "Divisi Logbook", role: "COORDINATOR", status: "ACTIVE" },
    { userId: "user_staff_log_1", email: "staff1.logbook@ppkormawa.id", name: "Hana Kartika", divisionName: "Divisi Logbook", role: "STAFF", status: "ACTIVE" },

    // Divisi Pemrograman
    { userId: "user_co_prog_1", email: "co.pemrograman@ppkormawa.id", name: "Irfan Hakim", divisionName: "Divisi Pemrograman", role: "COORDINATOR", status: "ACTIVE" },
    { userId: "user_staff_prog_1", email: "staff1.pemrograman@ppkormawa.id", name: "Joko Widodo", divisionName: "Divisi Pemrograman", role: "STAFF", status: "ACTIVE" },
    { userId: "user_staff_prog_2", email: "staff2.pemrograman@ppkormawa.id", name: "Kartika Sari", divisionName: "Divisi Pemrograman", role: "STAFF", status: "ACTIVE" },

    // Divisi Pembangunan
    { userId: "user_co_pemb_1", email: "co.pembangunan@ppkormawa.id", name: "Lukman Hakim", divisionName: "Divisi Pembangunan", role: "COORDINATOR", status: "ACTIVE" },
    { userId: "user_staff_pemb_1", email: "staff1.pembangunan@ppkormawa.id", name: "Maya Puspita", divisionName: "Divisi Pembangunan", role: "STAFF", status: "ACTIVE" },

    // Divisi PDD
    { userId: "user_co_pdd_1", email: "co.pdd@ppkormawa.id", name: "Nurul Hidayah", divisionName: "Divisi PDD", role: "COORDINATOR", status: "ACTIVE" },
    { userId: "user_staff_pdd_1", email: "staff1.pdd@ppkormawa.id", name: "Omar Abdullah", divisionName: "Divisi PDD", role: "STAFF", status: "ACTIVE" },

    // Pending Members (belum di-assign)
    { userId: "user_pending_1", email: "pending1@ppkormawa.id", name: "Rina Wati", divisionName: null, role: "STAFF", status: "PENDING" },
    { userId: "user_pending_2", email: "pending2@ppkormawa.id", name: "Tono Suryanto", divisionName: null, role: "STAFF", status: "PENDING" },
  ];

  for (const member of dummyMembers) {
    const division = member.divisionName ? createdDivisions.find((d) => d.name === member.divisionName) : null;
    await prisma.member.create({
      data: {
        userId: member.userId,
        email: member.email,
        name: member.name,
        divisionId: division?.id || null,
        role: member.role,
        status: member.status,
      },
    });
  }
  console.log(`✅ Created ${dummyMembers.length} members`);

  // Seed Dummy Assessments
  console.log("⭐ Creating dummy assessments...");
  const dummyAssessors = [
    { id: "user_1", name: "Ahmad Rizki" },
    { id: "user_2", name: "Siti Nurhaliza" },
    { id: "user_3", name: "Budi Santoso" },
    { id: "user_4", name: "Dewi Lestari" },
    { id: "user_5", name: "Eko Prasetyo" },
    { id: "user_6", name: "Fitri Amelia" },
    { id: "user_7", name: "Gunawan Wijaya" },
    { id: "user_8", name: "Hana Kartika" },
    { id: "user_9", name: "Irfan Hakim" },
    { id: "user_10", name: "Joko Widodo" },
    { id: "user_11", name: "Kartika Sari" },
    { id: "user_12", name: "Lukman Hakim" },
    { id: "user_13", name: "Maya Puspita" },
    { id: "user_14", name: "Nurul Hidayah" },
    { id: "user_15", name: "Omar Abdullah" },
  ];

  let assessmentCount = 0;
  for (const division of createdDivisions) {
    for (const assessor of dummyAssessors) {
      const scores = {
        kinerja: Math.floor(Math.random() * 2) + 4, // 4-5
        kedisiplinan: Math.floor(Math.random() * 2) + 4,
        komunikasi: Math.floor(Math.random() * 2) + 4,
        inisiatif: Math.floor(Math.random() * 2) + 4,
        kerjasama: Math.floor(Math.random() * 2) + 4,
        spesifik1: Math.floor(Math.random() * 2) + 4,
        spesifik2: Math.floor(Math.random() * 2) + 4,
      };

      const average = (scores.kinerja + scores.kedisiplinan + scores.komunikasi + scores.inisiatif + scores.kerjasama + scores.spesifik1 + scores.spesifik2) / 7;

      await prisma.assessment.create({
        data: {
          periodId: period.id,
          divisionId: division.id,
          assessorId: assessor.id,
          assessorName: assessor.name,
          ...scores,
          average,
        },
      });
      assessmentCount++;
    }
  }
  console.log(`✅ Created ${assessmentCount} assessments`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
