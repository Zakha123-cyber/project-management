import { z } from "zod";

export const CreateTask = z.object({
  title: z
    .string({
      required_error: "Judul task wajib diisi",
      invalid_type_error: "Judul task harus berupa teks",
    })
    .min(3, {
      message: "Judul task minimal 3 karakter",
    }),
  description: z.string().optional(),
  deadline: z.string({
    required_error: "Deadline wajib diisi",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Priority wajib dipilih",
  }),
  divisionId: z.string({
    required_error: "Division ID wajib diisi",
  }),
  assignedTo: z.string().optional(),
});
