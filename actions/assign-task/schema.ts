import { z } from "zod";

export const AssignTask = z.object({
  taskId: z.string(),
  assignedTo: z.string().nullable(), // null untuk unassign
});
