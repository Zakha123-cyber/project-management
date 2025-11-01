"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle2, Users } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

// Type untuk division dengan relasi
type DivisionWithTasks = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  tasks: {
    id: string;
    title: string;
    description: string | null;
    deadline: Date;
    priority: string;
    status: string;
  }[];
  members: {
    id: string;
    name: string | null;
    role: string;
  }[];
};

interface DivisionCardProps {
  division: DivisionWithTasks;
}

export const DivisionCard = ({ division }: DivisionCardProps) => {
  // Count tasks by status
  const pendingTasks = division.tasks.filter((t) => t.status === "PENDING").length;
  const inProgressTasks = division.tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completedTasks = division.tasks.filter((t) => t.status === "COMPLETED").length;

  // Get upcoming task
  const upcomingTask = division.tasks.find(
    (t) => t.status !== "COMPLETED" && new Date(t.deadline) > new Date()
  );

  // Get overdue tasks
  const overdueTasks = division.tasks.filter(
    (t) => t.status !== "COMPLETED" && new Date(t.deadline) < new Date()
  );

  return (
    <div
      className="bg-white rounded-lg shadow-md border-l-4 overflow-hidden hover:shadow-lg transition-shadow"
      style={{ borderLeftColor: division.color }}
    >
      {/* Header */}
      <div className="p-5 pb-4" style={{ backgroundColor: `${division.color}15` }}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-neutral-800">{division.name}</h3>
          <Badge
            variant="outline"
            className="ml-2"
            style={{ borderColor: division.color, color: division.color }}
          >
            {division.tasks.length} Tugas
          </Badge>
        </div>
        {division.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">{division.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="px-5 py-4 grid grid-cols-3 gap-2 border-b">
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Pending</div>
          <div className="text-lg font-bold text-yellow-600">{pendingTasks}</div>
        </div>
        <div className="text-center border-x">
          <div className="text-xs text-neutral-500 mb-1">Progress</div>
          <div className="text-lg font-bold text-blue-600">{inProgressTasks}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Selesai</div>
          <div className="text-lg font-bold text-green-600">{completedTasks}</div>
        </div>
      </div>

      {/* Members */}
      <div className="px-5 py-3 border-b bg-neutral-50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-500" />
          <span className="text-sm text-neutral-600">
            {division.members.length} Anggota Aktif
          </span>
        </div>
      </div>

      {/* Alerts */}
      <div className="p-5 space-y-3">
        {overdueTasks.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-700">
                {overdueTasks.length} Tugas Terlambat
              </p>
              <p className="text-xs text-red-600 truncate">{overdueTasks[0].title}</p>
            </div>
          </div>
        )}

        {upcomingTask && overdueTasks.length === 0 && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-700 truncate">
                {upcomingTask.title}
              </p>
              <p className="text-xs text-blue-600">
                Deadline:{" "}
                {format(new Date(upcomingTask.deadline), "dd MMM yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`ml-2 ${
                upcomingTask.priority === "HIGH"
                  ? "border-red-500 text-red-500"
                  : upcomingTask.priority === "MEDIUM"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-green-500 text-green-500"
              }`}
            >
              {upcomingTask.priority}
            </Badge>
          </div>
        )}

        {division.tasks.length === 0 && (
          <div className="flex items-center justify-center py-6 text-neutral-400">
            <p className="text-sm">Belum ada tugas</p>
          </div>
        )}

        {overdueTasks.length === 0 &&
          !upcomingTask &&
          division.tasks.length > 0 &&
          completedTasks === division.tasks.length && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <p className="text-sm font-semibold text-green-700">
                Semua tugas selesai! 🎉
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
