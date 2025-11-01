"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addTaskNote } from "@/actions/add-task-note";

interface TaskNotesDialogProps {
  task: any;
  member: any;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskNotesDialog = ({
  task,
  member,
  isOpen,
  onClose,
}: TaskNotesDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [noteContent, setNoteContent] = useState("");

  const canAddNote = 
    member.role === "ADMIN" ||
    (member.role === "COORDINATOR" && member.divisionId === task.divisionId);

  const handleAddNote = () => {
    if (!noteContent.trim()) {
      toast.error("Note tidak boleh kosong");
      return;
    }

    startTransition(() => {
      addTaskNote({ taskId: task.id, content: noteContent }).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Note berhasil ditambahkan!");
          setNoteContent("");
          router.refresh();
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notes & Comments
          </DialogTitle>
          <DialogDescription>
            Catatan dan komentar untuk task ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
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

          {/* Notes List */}
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                Semua Notes ({task.notes?.length || 0})
              </h4>
            </div>

            {task.notes && task.notes.length > 0 ? (
              <ScrollArea className="h-[250px] pr-4 border rounded-lg">
                <div className="space-y-3 p-3">
                  {task.notes.map((note: any) => (
                    <div
                      key={note.id}
                      className="p-3 border rounded-lg bg-white hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">
                              {note.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{note.authorName}</p>
                            <p className="text-xs text-neutral-500">
                              {format(new Date(note.createdAt), "dd MMM yyyy, HH:mm", {
                                locale: id,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-neutral-400 border rounded-lg">
                <MessageSquare className="w-12 h-12 mb-2" />
                <p className="text-sm">Belum ada notes</p>
              </div>
            )}
          </div>

          {/* Add Note Form */}
          {canAddNote ? (
            <div className="space-y-2 pt-3 border-t flex-shrink-0">
              <h4 className="font-medium text-sm">Tambah Note Baru</h4>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Tulis catatan atau komentar..."
                rows={2}
                disabled={isPending}
                className="resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  size="sm"
                >
                  Tutup
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={isPending || !noteContent.trim()}
                  size="sm"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Note
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t flex-shrink-0">
              <p className="text-sm text-neutral-500 text-center py-2">
                Hanya ADMIN dan COORDINATOR yang bisa menambahkan note
              </p>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
                size="sm"
              >
                Tutup
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
