"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, PlayCircle, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { updateTaskStatus } from "@/actions/update-task-status";

interface UpdateStatusDialogProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateStatusDialog = ({ task, isOpen, onClose }: UpdateStatusDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(task.progress || 0);
  const [selectedStatus, setSelectedStatus] = useState(task.status);

  const statusOptions = [
    {
      value: "NOT_STARTED",
      label: "Belum Mulai",
      icon: Circle,
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    },
    {
      value: "IN_PROGRESS",
      label: "Sedang Berjalan",
      icon: PlayCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      value: "COMPLETED",
      label: "Selesai",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const handleUpdateStatus = (status: string) => {
    setSelectedStatus(status);

    // Auto-update progress based on status
    if (status === "COMPLETED") {
      setProgress(100);
    } else if (status === "NOT_STARTED") {
      setProgress(0);
    }
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);

    // Auto-update status based on progress
    if (value[0] === 100) {
      setSelectedStatus("COMPLETED");
    } else if (value[0] > 0 && value[0] < 100) {
      setSelectedStatus("IN_PROGRESS");
    } else if (value[0] === 0) {
      setSelectedStatus("NOT_STARTED");
    }
  };

  const handleSave = () => {
    startTransition(() => {
      updateTaskStatus({
        taskId: task.id,
        status: selectedStatus,
        progress: progress,
      }).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Status berhasil diupdate!");
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
          <DialogTitle>Update Status & Progress</DialogTitle>
          <DialogDescription>Update status dan progress pengerjaan task</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedStatus === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleUpdateStatus(option.value)}
                    disabled={isPending}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                      ${isSelected ? `${option.bgColor} border-current ${option.color}` : "border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Progress</Label>
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <Slider value={[progress]} onValueChange={handleProgressChange} max={100} step={5} disabled={isPending} className="w-full" />
            <div className="flex justify-between text-xs text-neutral-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">Preview:</p>
            <div className="flex items-center gap-2">
              {statusOptions.find((s) => s.value === selectedStatus) && (
                <>
                  {(() => {
                    const StatusIcon = statusOptions.find((s) => s.value === selectedStatus)!.icon;
                    return <StatusIcon className="w-4 h-4" />;
                  })()}
                  <span className="font-medium text-sm">{statusOptions.find((s) => s.value === selectedStatus)?.label}</span>
                  <span className="text-sm">• {progress}%</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
