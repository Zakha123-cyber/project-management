"use client";

import { Calendar, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  deadline: string;
  status: "not-started" | "in-progress" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
}

interface Division {
  name: string;
  description: string;
  color: string;
  tasks: Task[];
}

const divisions: Division[] = [
  {
    name: "Divisi Sosialisasi",
    description: "Bertanggung jawab atas publikasi dan sosialisasi program kerja",
    color: "bg-blue-500",
    tasks: [
      { id: "1", title: "Membuat Rundown Grand Launching Paseban Kawis", deadline: "2025-09-14", status: "completed", priority: "high" },
      { id: "2", title: "Membuat produk susu kambing etawa & teh cascara", deadline: "2025-11-05", status: "not-started", priority: "medium" },
      { id: "3", title: "Persiapan Visitasi", deadline: "2025-11-04", status: "in-progress", priority: "high" },
    ],
  },
  {
    name: "Divisi Logbook",
    description: "Mengelola dokumentasi dan pelaporan kegiatan",
    color: "bg-green-500",
    tasks: [
      { id: "4", title: "Update logbook mingguan", deadline: "2025-10-27", status: "in-progress", priority: "high" },
      { id: "5", title: "Kompilasi dokumentasi Oktober", deadline: "2025-11-01", status: "not-started", priority: "medium" },
      { id: "6", title: "Laporan kegiatan bulan lalu", deadline: "2025-10-25", status: "completed", priority: "low" },
    ],
  },
  {
    name: "Divisi Pemrograman",
    description: "Mengembangkan sistem dan aplikasi organisasi",
    color: "bg-purple-500",
    tasks: [
      { id: "7", title: "Development website manajemen", deadline: "2025-11-05", status: "in-progress", priority: "high" },
      { id: "8", title: "Testing fitur chatbot", deadline: "2025-11-03", status: "in-progress", priority: "medium" },
      { id: "9", title: "Maintenance website paseban kawis", deadline: "2025-10-25", status: "completed", priority: "low" },
    ],
  },
  {
    name: "Divisi Pembangunan",
    description: "Mengelola infrastruktur dan pengembangan fisik",
    color: "bg-orange-500",
    tasks: [
      { id: "10", title: "Renovasi ruang sekretariat", deadline: "2025-11-15", status: "not-started", priority: "medium" },
      { id: "11", title: "Pengadaan peralatan kantor", deadline: "2025-11-08", status: "in-progress", priority: "low" },
      { id: "12", title: "Survey lokasi kegiatan", deadline: "2025-10-31", status: "not-started", priority: "medium" },
    ],
  },
  {
    name: "Divisi PDD",
    description: "Pengembangan Sumber Daya dan Departemen",
    color: "bg-teal-500",
    tasks: [
      { id: "13", title: "Pelatihan leadership anggota", deadline: "2025-11-12", status: "not-started", priority: "high" },
      { id: "14", title: "Evaluasi kinerja divisi", deadline: "2025-11-01", status: "in-progress", priority: "medium" },
      { id: "15", title: "Workshop skill development", deadline: "2025-11-20", status: "not-started", priority: "low" },
    ],
  },
  {
    name: "Sekretaris",
    description: "Mengatur administrasi dan kesekretariatan organisasi",
    color: "bg-pink-500",
    tasks: [
      { id: "16", title: "Notulensi rapat koordinasi", deadline: "2025-10-27", status: "in-progress", priority: "high" },
      { id: "17", title: "Arsip surat-menyurat", deadline: "2025-10-30", status: "not-started", priority: "medium" },
      { id: "18", title: "Penyusunan agenda mingguan", deadline: "2025-10-26", status: "completed", priority: "high" },
    ],
  },
  {
    name: "Bendahara",
    description: "Mengelola keuangan dan pelaporan finansial",
    color: "bg-yellow-500",
    tasks: [
      { id: "19", title: "Laporan keuangan bulanan", deadline: "2025-11-02", status: "in-progress", priority: "high" },
      { id: "20", title: "Verifikasi nota pengeluaran", deadline: "2025-10-28", status: "not-started", priority: "medium" },
      { id: "21", title: "Pengajuan anggaran Q4", deadline: "2025-10-24", status: "completed", priority: "high" },
    ],
  },
  {
    name: "Ketua Pelaksana",
    description: "Mengkoordinasi seluruh divisi dan program kerja",
    color: "bg-red-500",
    tasks: [
      { id: "22", title: "Rapat koordinasi bulanan", deadline: "2025-10-29", status: "not-started", priority: "high" },
      { id: "23", title: "Evaluasi program kerja", deadline: "2025-11-05", status: "not-started", priority: "high" },
      { id: "24", title: "Monitoring progress divisi", deadline: "2025-10-27", status: "in-progress", priority: "medium" },
    ],
  },
];

const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "overdue":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusText = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "Selesai";
    case "in-progress":
      return "Dikerjakan";
    case "overdue":
      return "Terlambat";
    default:
      return "Belum Mulai";
  }
};

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50";
    case "in-progress":
      return "text-blue-600 bg-blue-50";
    case "overdue":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getPriorityBadge = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Tinggi</span>;
    case "medium":
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Sedang</span>;
    default:
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Rendah</span>;
  }
};

const formatDeadline = (deadline: string) => {
  const date = new Date(deadline);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

export const DivisionDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-neutral-700" />
        <h2 className="text-2xl font-bold text-neutral-700">Dashboard Divisi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((division, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Header Card */}
            <div className={`${division.color} p-4 text-white`}>
              <h3 className="text-lg font-bold mb-1">{division.name}</h3>
              <p className="text-sm opacity-90">{division.description}</p>
            </div>

            {/* Task List */}
            <div className="p-4">
              <div className="space-y-3">
                {division.tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-md p-3 hover:border-gray-300 transition-colors">
                    {/* Task Title & Priority */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-neutral-700 flex-1">{task.title}</h4>
                      {getPriorityBadge(task.priority)}
                    </div>

                    {/* Deadline & Status */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDeadline(task.deadline)}</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="font-medium">{getStatusText(task.status)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Total Tugas: {division.tasks.length}</span>
                  <span>Selesai: {division.tasks.filter((t) => t.status === "completed").length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
