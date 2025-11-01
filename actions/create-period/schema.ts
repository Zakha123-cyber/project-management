import { z } from "zod";

export const CreatePeriod = z.object({
  name: z
    .string()
    .min(3, {
      message: "Nama periode minimal 3 karakter",
    }),
  startDate: z.string({
    required_error: "Tanggal mulai harus diisi",
  }),
  endDate: z.string({
    required_error: "Tanggal selesai harus diisi",
  }),
});
