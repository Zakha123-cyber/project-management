"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { format } from "date-fns";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAction } from "@/hooks/use-action";
import { updateTask } from "@/actions/update-task";
import { FormErrors } from "@/components/form/form-errors";

interface EditTaskDialogProps {
  task: any;
  member: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskDialog = ({ task, member, isOpen, onClose }: EditTaskDialogProps) => {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [deadline, setDeadline] = useState(task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "");

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setDeadline(task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd") : "");
    }
  }, [isOpen, task]);

  const { execute, isLoading, fieldErrors } = useAction(updateTask, {
    onSuccess: (data) => {
      toast.success(`Task "${data.title}" berhasil diupdate!`);
      router.refresh();
      onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Judul task harus diisi");
      return;
    }

    if (!deadline) {
      toast.error("Deadline harus diisi");
      return;
    }

    execute({
      id: task.id,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      deadline,
    });
  };

  // Check permission - STAFF can only edit status, not details
  const canEditDetails = member.role === "ADMIN" || (member.role === "COORDINATOR" && member.divisionId === task.divisionId);

  if (!canEditDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-neutral-500">
              Anda tidak memiliki akses untuk edit detail task ini.
              {member.role === "STAFF" && " Anda hanya bisa update status/progress task yang di-assign ke Anda."}
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Judul Task <span className="text-red-500">*</span>
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul task" disabled={isLoading} required />
            <FormErrors id="title" errors={fieldErrors} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Masukkan deskripsi task (opsional)" rows={4} disabled={isLoading} />
            <FormErrors id="description" errors={fieldErrors} />
          </div>

          {/* Priority and Deadline */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">
                Prioritas <span className="text-red-500">*</span>
              </Label>
              <Select value={priority} onValueChange={setPriority} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDIUM">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="HIGH">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormErrors id="priority" errors={fieldErrors} />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">
                Deadline <span className="text-red-500">*</span>
              </Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} disabled={isLoading} required min={format(new Date(), "yyyy-MM-dd")} />
              <FormErrors id="deadline" errors={fieldErrors} />
            </div>
          </div>

          {/* Info about division and assignment */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">
              ℹ️ <strong>Informasi:</strong>
            </p>
            <ul className="text-xs text-blue-600 space-y-1 ml-4 list-disc">
              <li>
                Divisi: <strong>{task.division.name}</strong> (tidak bisa diubah)
              </li>
              <li>
                Assignment: <strong>{task.assignedToName || "Belum di-assign"}</strong> - gunakan menu &ldquo;Assign&rdquo; untuk mengubah
              </li>
              <li>
                Status:{" "}
                <strong>
                  {task.status === "NOT_STARTED" && "Belum Mulai"}
                  {task.status === "IN_PROGRESS" && "Sedang Dikerjakan"}
                  {task.status === "COMPLETED" && "Selesai"}
                  {task.status === "OVERDUE" && "Terlambat"}
                </strong>{" "}
                - gunakan &ldquo;Update Status&rdquo; untuk mengubah
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
