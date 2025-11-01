import { z } from "zod";

export const AddTaskNote = z.object({
  taskId: z.string(),
  content: z.string().min(1, {
    message: "Note tidak boleh kosong",
  }),
});
