"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { TogglePeriod } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, isActive } = data;

  // Check if user is ADMIN
  const member = await db.member.findUnique({
    where: { userId },
  });

  if (!member || member.role !== "ADMIN") {
    return {
      error: "Hanya ADMIN yang dapat mengaktifkan/menonaktifkan periode penilaian",
    };
  }

  // Get the period
  const period = await db.assessmentPeriod.findUnique({
    where: { id },
  });

  if (!period) {
    return {
      error: "Periode tidak ditemukan",
    };
  }

  // If activating, check if there's already an active period
  if (isActive) {
    const existingActivePeriod = await db.assessmentPeriod.findFirst({
      where: {
        isActive: true,
        id: { not: id }, // Exclude current period
      },
    });

    if (existingActivePeriod) {
      return {
        error: `Periode "${existingActivePeriod.name}" masih aktif. Nonaktifkan terlebih dahulu.`,
      };
    }
  }

  let updatedPeriod;

  try {
    updatedPeriod = await db.assessmentPeriod.update({
      where: { id },
      data: { isActive },
    });
  } catch (error) {
    console.error("Error toggling period:", error);
    return {
      error: "Gagal mengubah status periode",
    };
  }

  revalidatePath(`/organization/${orgId}/penilaian`);

  return { data: updatedPeriod };
};

export const togglePeriod = createSafeAction(TogglePeriod, handler);
