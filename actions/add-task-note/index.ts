"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { AddTaskNote } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
    };
  }

  const { taskId, content } = data;

  // Get existing task
  const existingTask = await db.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    return {
      error: "Task tidak ditemukan",
    };
  }

  // Check user permission
  const member = await db.member.findUnique({
    where: { userId },
  });

  if (!member) {
    return {
      error: "Member tidak ditemukan",
    };
  }

  // Only ADMIN and COORDINATOR can add notes
  if (member.role === "STAFF") {
    return {
      error: "Anda tidak memiliki akses untuk menambahkan note",
    };
  }

  // COORDINATOR can only add notes to tasks in their division
  if (member.role === "COORDINATOR" && member.divisionId !== existingTask.divisionId) {
    return {
      error: "Anda hanya bisa menambahkan note di divisi Anda sendiri",
    };
  }

  let note;

  try {
    note = await db.taskNote.create({
      data: {
        taskId,
        content,
        authorId: userId,
        authorName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return {
      error: "Gagal menambahkan note",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  revalidatePath(`/organization/${orgId}/tasks`);
  revalidatePath(`/organization/${orgId}/division/${existingTask.divisionId}`);

  return { data: note };
};

export const addTaskNote = createSafeAction(AddTaskNote, handler);
