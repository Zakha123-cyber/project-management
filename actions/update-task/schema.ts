import { z } from "zod";

export const UpdateTask = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, {
      message: "Judul task minimal 3 karakter",
    })
    .optional(),
  description: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "OVERDUE"]).optional(),
  assignedTo: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
});
