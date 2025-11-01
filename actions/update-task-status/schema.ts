import { z } from "zod";

export const UpdateTaskStatus = z.object({
  taskId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "OVERDUE"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});
