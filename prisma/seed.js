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

async function main() {
  console.log("🌱 Seeding database...");

  // Bersihkan data lama
  console.log("🗑️  Clearing existing data...");
  await prisma.member.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.assessmentPeriod.deleteMany();
  await prisma.division.deleteMany();
  console.log("✅ Cleared existing data");

  // Seed Divisions
  console.log("📁 Creating divisions...");
  const createdDivisions = await Promise.all(divisions.map((division) => prisma.division.create({ data: division })));
  console.log(`✅ Created ${createdDivisions.length} divisions`);

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

  // Seed Assessment Periods (3 Periods)
  console.log("📅 Creating assessment periods...");
  
  const period1 = await prisma.assessmentPeriod.create({
    data: {
      name: "Juli-Agustus 2025",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-08-31"),
      isActive: false,
    },
  });
  console.log(`✅ Created period: ${period1.name}`);

  const period2 = await prisma.assessmentPeriod.create({
    data: {
      name: "September-Oktober 2025",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-10-31"),
      isActive: false,
    },
  });
  console.log(`✅ Created period: ${period2.name}`);

  const period3 = await prisma.assessmentPeriod.create({
    data: {
      name: "November 2025",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2025-11-30"),
      isActive: true,
    },
  });
  console.log(`✅ Created period: ${period3.name}`);

  // Seed Dummy Members
  console.log("👥 Creating dummy members...");
  const dummyMembers = [
    // BPI (Badan Pengurus Inti) - 5 orang
    { userId: "user_001", email: "abdurrohman.qoim@ppkormawa.id", name: "Abdurrohman Qoim Haqqi M.", nim: "232410103082", divisionName: "BPI (Badan Pengurus Inti)", role: "ADMIN", status: "ACTIVE" }, // Ketua
    { userId: "user_002", email: "keysha.kinanti@ppkormawa.id", name: "Keysha Kinanti A", nim: "232410101067", divisionName: "BPI (Badan Pengurus Inti)", role: "COORDINATOR", status: "ACTIVE" }, // Sekretaris
    { userId: "user_003", email: "risti.gadis@ppkormawa.id", name: "Risti Gadis Astiyanto", nim: "232410102031", divisionName: "BPI (Badan Pengurus Inti)", role: "COORDINATOR", status: "ACTIVE" }, // Bendahara I
    { userId: "user_004", email: "clarissa.mery@ppkormawa.id", name: "Clarissa Mery Irawan", nim: "232410102008", divisionName: "BPI (Badan Pengurus Inti)", role: "COORDINATOR", status: "ACTIVE" }, // Bendahara II
    { userId: "user_016", email: "nurul.hadits@ppkormawa.id", name: "Nurul Hadits", nim: "222410102043", divisionName: "BPI (Badan Pengurus Inti)", role: "ADMIN", status: "ACTIVE" }, // Ketua BEM

    // Divisi Pembangunan - 6 orang (1 Koordinator + 5 Anggota)
    { userId: "user_005", email: "ahmad.hisyam@ppkormawa.id", name: "Ahmad Hisyam Ramadhan", nim: "232410103063", divisionName: "Divisi Pembangunan", role: "COORDINATOR", status: "ACTIVE" }, // Koordinator
    { userId: "user_008", email: "alfi.nur@ppkormawa.id", name: "Alfi Nur Qodri Mahfud", nim: "232410102057", divisionName: "Divisi Pembangunan", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_015", email: "triantono.adi@ppkormawa.id", name: "Triantono Adi Priambodo", nim: "222410101061", divisionName: "Divisi Pembangunan", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_019", email: "elan.abirahman@ppkormawa.id", name: "Elan Abirahman Rabbani", nim: "232410102072", divisionName: "Divisi Pembangunan", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_021", email: "mohammad.raihan@ppkormawa.id", name: "Mohammad Raihan Rabbani", nim: "232410101059", divisionName: "Divisi Pembangunan", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_029", email: "yesaya.alfason@ppkormawa.id", name: "Yesaya Alfason Dayeshua", nim: "232410102081", divisionName: "Divisi Pembangunan", role: "STAFF", status: "ACTIVE" }, // Anggota

    // Divisi Logbook - 7 orang (1 Koordinator + 6 Anggota)
    { userId: "user_006", email: "muhammad.rafi@ppkormawa.id", name: "Muhammad Rafi Kurniawan", nim: "232410103098", divisionName: "Divisi Logbook", role: "COORDINATOR", status: "ACTIVE" }, // Koordinator
    { userId: "user_009", email: "karin.tiara@ppkormawa.id", name: "Karin Tiara Rahmadina", nim: "232410102061", divisionName: "Divisi Logbook", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_014", email: "revinda.dwi@ppkormawa.id", name: "Revinda Dwi Indar Parawangsa", nim: "232410102026", divisionName: "Divisi Logbook", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_017", email: "sefiand.neeza@ppkormawa.id", name: "Sefiand Neeza Efendy", nim: "232410103085", divisionName: "Divisi Logbook", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_025", email: "vindi.dwi@ppkormawa.id", name: "Vindi Dwi Septia Nada", nim: "232410102009", divisionName: "Divisi Logbook", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_027", email: "sastria.elvaretta@ppkormawa.id", name: "Sastria Elvaretta Andhara Putri", nim: "232410102015", divisionName: "Divisi Logbook", role: "STAFF", status: "ACTIVE" }, // Anggota

    // Divisi PDD - 3 orang (1 Koordinator + 2 Anggota)
    { userId: "user_007", email: "aldi.ahmad@ppkormawa.id", name: "Aldi Ahmad Dani", nim: "232410103074", divisionName: "Divisi PDD", role: "COORDINATOR", status: "ACTIVE" }, // Koordinator
    { userId: "user_024", email: "lutfi.arif@ppkormawa.id", name: "Lutfi Arif Widianto", nim: "232410102035", divisionName: "Divisi PDD", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_030", email: "ahmad.danar@ppkormawa.id", name: "Ahmad Danar Purwonugroho", nim: "232410103096", divisionName: "Divisi PDD", role: "STAFF", status: "ACTIVE" }, // Anggota

    // Divisi Sosialisasi - 9 orang (1 Koordinator + 8 Anggota)
    { userId: "user_011", email: "intan.purnama@ppkormawa.id", name: "Intan Purnama Putri Hidayah", nim: "232410103003", divisionName: "Divisi Sosialisasi", role: "COORDINATOR", status: "ACTIVE" }, // Koordinator
    { userId: "user_013", email: "maulidika.nur@ppkormawa.id", name: "Maulidika Nur Muhammad Aspari", nim: "231510601092", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_018", email: "fahril.afandi@ppkormawa.id", name: "Fahril Afandi", nim: "232410102092", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_020", email: "yuanita.tri@ppkormawa.id", name: "Yuanita Tri Hastutik R.", nim: "222410103011", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_022", email: "rifqi.adrianto@ppkormawa.id", name: "Rifqi Adrianto", nim: "232410103042", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_023", email: "devitri.buaton@ppkormawa.id", name: "Devitri Buaton", nim: "232410103026", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_026", email: "wahyu.dwi@ppkormawa.id", name: "Wahyu Dwi Wulandari", nim: "232410102091", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota
    { userId: "user_028", email: "dinar.ayu@ppkormawa.id", name: "Dinar Ayu Pratiwi", nim: "222410101068", divisionName: "Divisi Sosialisasi", role: "STAFF", status: "ACTIVE" }, // Anggota

    // Divisi Pemrograman - 2 orang (1 Koordinator + 1 Anggota)
    { userId: "user_012", email: "zakha.aditya@ppkormawa.id", name: "Zakha Aditya Hadiansyah", nim: "232410103061", divisionName: "Divisi Pemrograman", role: "COORDINATOR", status: "ACTIVE" }, // Koordinator
    { userId: "user_010", email: "anugrah.farel@ppkormawa.id", name: "Anugrah Farel Putra Firdyantara", nim: "232410102018", divisionName: "Divisi Pemrograman", role: "STAFF", status: "ACTIVE" }, // Anggota
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

  // Seed Multi-Period Assessments (Peer-to-Peer with Progress Tracking)
  console.log("⭐ Creating multi-period assessments with progress tracking...");

  // Get all active members
  const activeMembers = dummyMembers.filter((m) => m.status === "ACTIVE");

  // Select 15 assessors: 6 coordinators + 9 staff
  const coordinators = activeMembers.filter((m) => m.role === "COORDINATOR");
  const staffMembers = activeMembers.filter((m) => m.role === "STAFF");
  
  // Get 6 coordinators (all of them since we have exactly 8)
  const selectedCoordinators = coordinators.slice(0, 6);
  
  // Get 9 random staff members
  const selectedStaff = staffMembers
    .sort(() => Math.random() - 0.5)
    .slice(0, 9);
  
  const assessors = [...selectedCoordinators, ...selectedStaff];
  console.log(`📋 Selected ${assessors.length} assessors (${selectedCoordinators.length} coordinators + ${selectedStaff.length} staff)`);

  // Store assessment pairs for consistency across periods
  const assessmentPairs = [];

  // For each assessor, select 3-5 random assessees
  for (const assessor of assessors) {
    const numAssessments = Math.floor(Math.random() * 3) + 3; // 3-5 assessments
    const assessees = activeMembers
      .filter((m) => m.userId !== assessor.userId) // Don't assess self
      .sort(() => Math.random() - 0.5)
      .slice(0, numAssessments);

    for (const assessee of assessees) {
      assessmentPairs.push({ assessor, assessee });
    }
  }
  console.log(`📊 Generated ${assessmentPairs.length} assessment pairs`);

  // Helper function to generate scores within a range with decimals
  const generateScore = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
  };

  // Generate assessments for Period 1 (Juli-Agustus 2025) - Scores 3.0-4.0
  console.log("⏳ Creating assessments for Period 1 (Juli-Agustus 2025, scores 3.0-4.0)...");
  let period1Count = 0;
  
  for (const { assessor, assessee } of assessmentPairs) {
    const assesseeDivision = assessee.divisionName 
      ? createdDivisions.find((d) => d.name === assessee.divisionName) 
      : null;

    // Generate scores 3.0-4.0 for Hard Skills
    const hardSkills = Array.from({ length: 7 }, () => generateScore(3.0, 4.0));

    // Generate scores 3.0-4.0 for Soft Skills
    const softSkills = Array.from({ length: 12 }, () => generateScore(3.0, 4.0));

    const averageHardSkill = parseFloat((hardSkills.reduce((a, b) => a + b, 0) / 7).toFixed(2));
    const averageSoftSkill = parseFloat((softSkills.reduce((a, b) => a + b, 0) / 12).toFixed(2));
    const averageTotal = parseFloat(((averageHardSkill + averageSoftSkill) / 2).toFixed(2));

    await prisma.assessment.create({
      data: {
        periodId: period1.id,
        assessorId: assessor.userId,
        assessorName: assessor.name,
        assesseeId: assessee.userId,
        assesseeName: assessee.name,
        assesseeDivisionId: assesseeDivision?.id || createdDivisions[0].id,

        // Hard Skills
        hardSkill1: hardSkills[0],
        hardSkill2: hardSkills[1],
        hardSkill3: hardSkills[2],
        hardSkill4: hardSkills[3],
        hardSkill5: hardSkills[4],
        hardSkill6: hardSkills[5],
        hardSkill7: hardSkills[6],

        // Soft Skills
        softSkill1: softSkills[0],
        softSkill2: softSkills[1],
        softSkill3: softSkills[2],
        softSkill4: softSkills[3],
        softSkill5: softSkills[4],
        softSkill6: softSkills[5],
        softSkill7: softSkills[6],
        softSkill8: softSkills[7],
        softSkill9: softSkills[8],
        softSkill10: softSkills[9],
        softSkill11: softSkills[10],
        softSkill12: softSkills[11],

        averageHardSkill,
        averageSoftSkill,
        averageTotal,
      },
    });
    period1Count++;
  }
  console.log(`✅ Created ${period1Count} assessments for Period 1`);

  // Generate assessments for Period 2 (September-Oktober 2025) - Scores 4.0-5.0 (showing improvement)
  console.log("⏳ Creating assessments for Period 2 (September-Oktober 2025, scores 4.0-5.0)...");
  let period2Count = 0;
  
  for (const { assessor, assessee } of assessmentPairs) {
    const assesseeDivision = assessee.divisionName 
      ? createdDivisions.find((d) => d.name === assessee.divisionName) 
      : null;

    // Generate scores 4.0-5.0 for Hard Skills (showing improvement)
    const hardSkills = Array.from({ length: 7 }, () => generateScore(4.0, 5.0));

    // Generate scores 4.0-5.0 for Soft Skills (showing improvement)
    const softSkills = Array.from({ length: 12 }, () => generateScore(4.0, 5.0));

    const averageHardSkill = parseFloat((hardSkills.reduce((a, b) => a + b, 0) / 7).toFixed(2));
    const averageSoftSkill = parseFloat((softSkills.reduce((a, b) => a + b, 0) / 12).toFixed(2));
    const averageTotal = parseFloat(((averageHardSkill + averageSoftSkill) / 2).toFixed(2));

    await prisma.assessment.create({
      data: {
        periodId: period2.id,
        assessorId: assessor.userId,
        assessorName: assessor.name,
        assesseeId: assessee.userId,
        assesseeName: assessee.name,
        assesseeDivisionId: assesseeDivision?.id || createdDivisions[0].id,

        // Hard Skills
        hardSkill1: hardSkills[0],
        hardSkill2: hardSkills[1],
        hardSkill3: hardSkills[2],
        hardSkill4: hardSkills[3],
        hardSkill5: hardSkills[4],
        hardSkill6: hardSkills[5],
        hardSkill7: hardSkills[6],

        // Soft Skills
        softSkill1: softSkills[0],
        softSkill2: softSkills[1],
        softSkill3: softSkills[2],
        softSkill4: softSkills[3],
        softSkill5: softSkills[4],
        softSkill6: softSkills[5],
        softSkill7: softSkills[6],
        softSkill8: softSkills[7],
        softSkill9: softSkills[8],
        softSkill10: softSkills[9],
        softSkill11: softSkills[10],
        softSkill12: softSkills[11],

        averageHardSkill,
        averageSoftSkill,
        averageTotal,
      },
    });
    period2Count++;
  }
  console.log(`✅ Created ${period2Count} assessments for Period 2`);
  console.log(`📈 Total assessments created: ${period1Count + period2Count} (${period1Count} + ${period2Count})`);
  console.log(`ℹ️  Period 3 (November 2025) has no assessments as it's the active period`);

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
