"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTask } from "@/actions/create-task";

interface CreateTaskFormProps {
  divisions: any[];
  onSuccess?: () => void;
}

export const CreateTaskForm = ({ divisions, onSuccess }: CreateTaskFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    divisionId: divisions[0]?.id || "",
  });

  const [selectedDivision, setSelectedDivision] = useState(divisions[0]?.id || "");
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("");

  // Load members when division changes
  const handleDivisionChange = async (divisionId: string) => {
    setSelectedDivision(divisionId);
    setFormData({ ...formData, divisionId });

    // Fetch members of selected division
    try {
      const response = await fetch(`/api/divisions/${divisionId}/members`);
      const data = await response.json();
      setMembers(data.members || []);
      setSelectedMember("");
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.deadline || !formData.divisionId) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    const submitData = {
      ...formData,
      assignedTo: selectedMember || undefined,
    };

    startTransition(() => {
      createTask(submitData).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Jobdesk berhasil dibuat!");
          router.refresh();
          onSuccess?.();
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Judul Jobdesk <span className="text-red-500">*</span>
        </Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: Membuat Proposal Event" disabled={isPending} required />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi detail tentang jobdesk ini..." rows={4} disabled={isPending} />
      </div>

      {/* Division */}
      <div className="space-y-2">
        <Label>
          Divisi <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedDivision} onValueChange={handleDivisionChange} disabled={isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih divisi" />
          </SelectTrigger>
          <SelectContent>
            {divisions.map((division) => (
              <SelectItem key={division.id} value={division.id}>
                {division.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assigned To */}
      <div className="space-y-2">
        <Label>Assign ke Member (Opsional)</Label>
        <Select value={selectedMember} onValueChange={setSelectedMember} disabled={isPending || members.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={members.length === 0 ? "Pilih divisi dulu" : "Pilih member (opsional)"} />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.userId} value={member.userId}>
                {member.name} - {member.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Deadline */}
        <div className="space-y-2">
          <Label htmlFor="deadline">
            Deadline <span className="text-red-500">*</span>
          </Label>
          <Input id="deadline" type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} disabled={isPending} required />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>
            Prioritas <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.priority} onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => setFormData({ ...formData, priority: value })} disabled={isPending}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Rendah</SelectItem>
              <SelectItem value="MEDIUM">Sedang</SelectItem>
              <SelectItem value="HIGH">Tinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isPending}>
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Membuat..." : "Buat Jobdesk"}
        </Button>
      </div>
    </form>
  );
};
