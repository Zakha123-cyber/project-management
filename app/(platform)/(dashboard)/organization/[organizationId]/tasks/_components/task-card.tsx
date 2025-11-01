"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, User, Clock, Flag, MoreVertical, Pencil, Trash2, UserPlus, RefreshCw, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { AssignTaskDialog } from "./assign-task-dialog";
import { UpdateStatusDialog } from "./update-status-dialog";
import { TaskNotesDialog } from "./task-notes-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";

interface TaskCardProps {
  task: any;
  member: any;
}

export const TaskCard = ({ task, member }: TaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Check permissions
  const canEdit = member.role === "ADMIN" || (member.role === "COORDINATOR" && member.divisionId === task.divisionId) || (member.role === "STAFF" && member.userId === task.assignedTo);

  const canDelete = member.role === "ADMIN" || (member.role === "COORDINATOR" && member.divisionId === task.divisionId);

  const canAssign = member.role === "ADMIN" || (member.role === "COORDINATOR" && member.divisionId === task.divisionId);

  // Status badge color
  const getStatusBadge = () => {
    switch (task.status) {
      case "NOT_STARTED":
        return (
          <Badge variant="outline" className="bg-gray-100">
            Belum Mulai
          </Badge>
        );
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">Sedang Berjalan</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "OVERDUE":
        return <Badge className="bg-red-500">Terlambat</Badge>;
      default:
        return <Badge>{task.status}</Badge>;
    }
  };

  // Priority badge
  const getPriorityBadge = () => {
    switch (task.priority) {
      case "HIGH":
        return (
          <Badge variant="destructive">
            <Flag className="w-3 h-3 mr-1" />
            Tinggi
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <Flag className="w-3 h-3 mr-1" />
            Sedang
          </Badge>
        );
      case "LOW":
        return (
          <Badge variant="outline">
            <Flag className="w-3 h-3 mr-1" />
            Rendah
          </Badge>
        );
      default:
        return <Badge>{task.priority}</Badge>;
    }
  };

  // Format deadline
  const formattedDeadline = format(new Date(task.deadline), "dd MMMM yyyy, HH:mm", { locale: id });

  // Check if deadline is near (3 days)
  const daysUntilDeadline = Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isDeadlineNear = daysUntilDeadline <= 3 && daysUntilDeadline > 0 && task.status !== "COMPLETED";

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            {getStatusBadge()}
            {getPriorityBadge()}
            {task.notes && task.notes.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <MessageSquare className="w-3 h-3 mr-1" />
                {task.notes.length}
              </Badge>
            )}
          </div>

          {/* Division Badge */}
          <Badge variant="outline" className="mb-2" style={{ borderColor: task.division.color, color: task.division.color }}>
            {task.division.name}
          </Badge>
        </div>

        {/* Actions Menu */}
        {(canEdit || canDelete || canAssign) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canAssign && (
                <DropdownMenuItem onClick={() => setShowAssignDialog(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {task.assignedTo ? "Reassign" : "Assign"}
                </DropdownMenuItem>
              )}
              {canEdit && (
                <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Status
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowNotesDialog(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Notes ({task.notes?.length || 0})
              </DropdownMenuItem>
              {(canAssign || canEdit) && canDelete && <DropdownMenuSeparator />}
              {canEdit && (
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Description */}
      {task.description && <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{task.description}</p>}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-neutral-500">Progress</span>
          <span className="text-xs font-medium">{task.progress}%</span>
        </div>
        <Progress value={task.progress} className="h-2" />
      </div>

      {/* Quick Actions for Assignee */}
      {member.userId === task.assignedTo && task.status !== "COMPLETED" && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 mb-2 font-medium">Quick Actions:</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowStatusDialog(true)} className="flex-1 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Update Progress
            </Button>
          </div>
        </div>
      )}

      {/* Meta Information */}
      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
        {/* Deadline */}
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span className={isDeadlineNear ? "text-orange-600 font-medium" : ""}>{formattedDeadline}</span>
        </div>

        {/* Assigned To */}
        {task.assignedToName ? (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{task.assignedToName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-orange-600">
            <User className="w-4 h-4" />
            <span className="text-sm">Belum di-assign</span>
          </div>
        )}

        {/* Created By */}
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="text-xs">Dibuat oleh {task.createdByName}</span>
        </div>
      </div>

      {/* Deadline Warning */}
      {isDeadlineNear && <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">⚠️ Deadline dalam {daysUntilDeadline} hari lagi!</div>}

      {/* Assign Task Dialog */}
      <AssignTaskDialog task={task} isOpen={showAssignDialog} onClose={() => setShowAssignDialog(false)} />

      {/* Update Status Dialog */}
      <UpdateStatusDialog task={task} isOpen={showStatusDialog} onClose={() => setShowStatusDialog(false)} />

      {/* Task Notes Dialog */}
      <TaskNotesDialog task={task} member={member} isOpen={showNotesDialog} onClose={() => setShowNotesDialog(false)} />

      {/* Edit Task Dialog */}
      <EditTaskDialog task={task} member={member} isOpen={showEditDialog} onClose={() => setShowEditDialog(false)} />

      {/* Delete Task Dialog */}
      <DeleteTaskDialog task={task} isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </div>
  );
};
