"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteTask } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;

  // Get existing task
  const existingTask = await db.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return {
      error: "Task tidak ditemukan",
    };
  }

  // Check user role and permission
  const member = await db.member.findUnique({
    where: { userId },
  });

  if (!member) {
    return {
      error: "Member tidak ditemukan",
    };
  }

  // Only ADMIN and COORDINATOR can delete tasks
  if (member.role === "STAFF") {
    return {
      error: "Anda tidak memiliki akses untuk menghapus task",
    };
  }

  // If COORDINATOR, can only delete task from their division
  if (member.role === "COORDINATOR" && member.divisionId !== existingTask.divisionId) {
    return {
      error: "Anda hanya bisa menghapus task di divisi Anda sendiri",
    };
  }

  let task;

  try {
    task = await db.task.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      error: "Gagal menghapus task",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  revalidatePath(`/organization/${orgId}/division/${existingTask.divisionId}`);

  return { data: task };
};

export const deleteTask = createSafeAction(DeleteTask, handler);
