"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskButtonProps {
  divisions: any[];
  userRole: "ADMIN" | "COORDINATOR" | "STAFF";
  userDivisionId: string | null;
}

export const CreateTaskButton = ({ divisions, userRole, userDivisionId }: CreateTaskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter divisions based on role
  const availableDivisions = userRole === "COORDINATOR" ? divisions.filter((d) => d.id === userDivisionId) : divisions;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Buat Jobdesk Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Jobdesk Baru</DialogTitle>
        </DialogHeader>
        <CreateTaskForm divisions={availableDivisions} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
