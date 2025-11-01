"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useAction } from "@/hooks/use-action";
import { deleteTask } from "@/actions/delete-task";

interface DeleteTaskDialogProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteTaskDialog = ({ task, isOpen, onClose }: DeleteTaskDialogProps) => {
  const router = useRouter();

  const { execute, isLoading } = useAction(deleteTask, {
    onSuccess: (data) => {
      toast.success(`Task "${data.title}" berhasil dihapus!`);
      router.refresh();
      onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDelete = () => {
    execute({ id: task.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Hapus Task
          </DialogTitle>
          <DialogDescription className="pt-3">Apakah Anda yakin ingin menghapus task ini?</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Task Info */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
            <div>
              <p className="text-xs text-gray-500">Judul Task:</p>
              <p className="text-sm font-medium">{task.title}</p>
            </div>
            {task.description && (
              <div>
                <p className="text-xs text-gray-500">Deskripsi:</p>
                <p className="text-sm line-clamp-2">{task.description}</p>
              </div>
            )}
            <div className="flex items-center gap-4 pt-2 border-t">
              <div>
                <p className="text-xs text-gray-500">Divisi:</p>
                <p className="text-sm font-medium">{task.division.name}</p>
              </div>
              {task.assignedToName && (
                <div>
                  <p className="text-xs text-gray-500">Assigned to:</p>
                  <p className="text-sm font-medium">{task.assignedToName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">
              ⚠️ <strong>Perhatian:</strong> Task yang dihapus tidak dapat dikembalikan. Semua data termasuk notes akan hilang permanen.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Menghapus..." : "Hapus Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
