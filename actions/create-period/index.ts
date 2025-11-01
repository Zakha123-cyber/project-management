"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreatePeriod } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { name, startDate, endDate } = data;

  // Check if user is ADMIN
  const member = await db.member.findUnique({
    where: { userId },
  });

  if (!member || member.role !== "ADMIN") {
    return {
      error: "Hanya ADMIN yang dapat membuat periode penilaian",
    };
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return {
      error: "Tanggal selesai harus setelah tanggal mulai",
    };
  }

  // Check for overlapping active periods
  const existingActivePeriod = await db.assessmentPeriod.findFirst({
    where: {
      isActive: true,
    },
  });

  if (existingActivePeriod) {
    return {
      error: `Periode "${existingActivePeriod.name}" masih aktif. Nonaktifkan terlebih dahulu sebelum membuat periode baru.`,
    };
  }

  let period;

  try {
    period = await db.assessmentPeriod.create({
      data: {
        name,
        startDate: start,
        endDate: end,
        isActive: false, // Tidak langsung aktif, perlu diaktifkan manual
      },
    });
  } catch (error) {
    console.error("Error creating period:", error);
    return {
      error: "Gagal membuat periode penilaian",
    };
  }

  revalidatePath(`/organization/${orgId}/penilaian`);

  return { data: period };
};

export const createPeriod = createSafeAction(CreatePeriod, handler);
