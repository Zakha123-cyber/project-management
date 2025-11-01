"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAction } from "@/hooks/use-action";
import { createPeriod } from "@/actions/create-period";
import { FormErrors } from "@/components/form/form-errors";

interface CreatePeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePeriodDialog = ({ isOpen, onClose, onSuccess }: CreatePeriodDialogProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { execute, isLoading, fieldErrors } = useAction(createPeriod, {
    onSuccess: (data) => {
      toast.success(`Periode "${data.name}" berhasil dibuat!`);
      setName("");
      setStartDate("");
      setEndDate("");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama periode harus diisi");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Tanggal mulai dan selesai harus diisi");
      return;
    }

    execute({
      name: name.trim(),
      startDate,
      endDate,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setStartDate("");
      setEndDate("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Periode Penilaian Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Periode <span className="text-red-500">*</span>
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Periode Oktober 2025" disabled={isLoading} required />
            <FormErrors id="name" errors={fieldErrors} />
            <p className="text-xs text-neutral-500">Nama periode untuk identifikasi (contoh: "Oktober 2025", "Semester 1 2025")</p>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">
              Tanggal Mulai <span className="text-red-500">*</span>
            </Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={isLoading} required min={format(new Date(), "yyyy-MM-dd")} />
            <FormErrors id="startDate" errors={fieldErrors} />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">
              Tanggal Selesai <span className="text-red-500">*</span>
            </Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={isLoading} required min={startDate || format(new Date(), "yyyy-MM-dd")} />
            <FormErrors id="endDate" errors={fieldErrors} />
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600">
              ℹ️ <strong>Catatan:</strong> Periode yang baru dibuat tidak langsung aktif. Anda perlu mengaktifkannya secara manual setelah dibuat. Hanya satu periode yang bisa aktif dalam satu waktu.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Membuat..." : "Buat Periode"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
