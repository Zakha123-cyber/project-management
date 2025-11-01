import { db } from "@/lib/db";
import { DivisionCard } from "./division-card";
import { Users } from "lucide-react";

export const DivisionDashboard = async () => {
  // Fetch divisions dengan tasks
  const divisions = await db.division.findMany({
    include: {
      tasks: {
        orderBy: { deadline: "asc" },
      },
      members: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  if (divisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
        <Users className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data Divisi</h3>
        <p className="text-gray-500">Jalankan seed database untuk mengisi data dummy</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-neutral-700" />
        <h2 className="text-2xl font-bold text-neutral-700">Dashboard Divisi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((division) => (
          <DivisionCard key={division.id} division={division} />
        ))}
      </div>
    </div>
  );
};
