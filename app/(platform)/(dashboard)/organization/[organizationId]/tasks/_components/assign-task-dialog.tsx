"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { assignTask } from "@/actions/assign-task";

interface AssignTaskDialogProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignTaskDialog = ({
  task,
  isOpen,
  onClose,
}: AssignTaskDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>(
    task.assignedTo || ""
  );
  const [loading, setLoading] = useState(false);

  // Load members of the task's division
  useEffect(() => {
    if (isOpen && task.divisionId) {
      setLoading(true);
      fetch(`/api/divisions/${task.divisionId}/members`)
        .then((res) => res.json())
        .then((data) => {
          setMembers(data.members || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching members:", error);
          setMembers([]);
          setLoading(false);
        });
    }
  }, [isOpen, task.divisionId]);

  const handleAssign = () => {
    if (!selectedMember && task.assignedTo) {
      // Unassign
      startTransition(() => {
        assignTask({ taskId: task.id, assignedTo: null }).then((result) => {
          if (result.error) {
            toast.error(result.error);
          } else {
            toast.success("Task berhasil di-unassign!");
            router.refresh();
            onClose();
          }
        });
      });
    } else if (selectedMember) {
      // Assign or Reassign
      startTransition(() => {
        assignTask({ taskId: task.id, assignedTo: selectedMember }).then(
          (result) => {
            if (result.error) {
              toast.error(result.error);
            } else {
              toast.success(
                task.assignedTo
                  ? "Task berhasil di-reassign!"
                  : "Task berhasil di-assign!"
              );
              router.refresh();
              onClose();
            }
          }
        );
      });
    } else {
      toast.error("Pilih member terlebih dahulu");
    }
  };

  const handleUnassign = () => {
    startTransition(() => {
      assignTask({ taskId: task.id, assignedTo: null }).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Task berhasil di-unassign!");
          router.refresh();
          onClose();
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Jobdesk</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Info */}
          <div className="p-3 bg-neutral-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{task.title}</h4>
            <Badge
              variant="outline"
              style={{
                borderColor: task.division?.color,
                color: task.division?.color,
              }}
            >
              {task.division?.name}
            </Badge>
          </div>

          {/* Current Assignment */}
          {task.assignedToName && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-neutral-500">Saat ini assigned ke:</p>
                  <p className="font-medium text-sm">{task.assignedToName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnassign}
                disabled={isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Select Member */}
          <div className="space-y-2">
            <Label>
              {task.assignedTo ? "Reassign ke:" : "Assign ke:"}
            </Label>
            <Select
              value={selectedMember}
              onValueChange={setSelectedMember}
              disabled={isPending || loading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loading
                      ? "Loading members..."
                      : members.length === 0
                      ? "Tidak ada member aktif"
                      : "Pilih member"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    <div className="flex items-center gap-2">
                      <span>{member.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button onClick={handleAssign} disabled={isPending || loading}>
              {isPending
                ? "Processing..."
                : task.assignedTo
                ? "Reassign"
                : "Assign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
