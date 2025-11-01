"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateTaskStatus } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { taskId, status, progress } = data;

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

  // Permission check
  const isAdmin = member.role === "ADMIN";
  const isCoordinator = member.role === "COORDINATOR" && member.divisionId === existingTask.divisionId;
  const isAssignee = member.userId === existingTask.assignedTo;

  // STAFF can only update their own assigned tasks
  if (member.role === "STAFF" && !isAssignee) {
    return {
      error: "Anda hanya bisa update status task yang di-assign ke Anda",
    };
  }

  // COORDINATOR can only update tasks in their division
  if (member.role === "COORDINATOR" && !isCoordinator) {
    return {
      error: "Anda hanya bisa update task di divisi Anda sendiri",
    };
  }

  let task;

  try {
    // Prepare update data
    const updateData: any = {};

    if (status !== undefined) {
      updateData.status = status;

      // Auto-update progress based on status
      if (status === "COMPLETED" && progress === undefined) {
        updateData.progress = 100;
      } else if (status === "NOT_STARTED" && progress === undefined) {
        updateData.progress = 0;
      }
    }

    if (progress !== undefined) {
      updateData.progress = progress;

      // Auto-update status based on progress
      if (progress === 100 && status === undefined) {
        updateData.status = "COMPLETED";
      } else if (progress > 0 && progress < 100 && status === undefined) {
        updateData.status = "IN_PROGRESS";
      } else if (progress === 0 && status === undefined) {
        updateData.status = "NOT_STARTED";
      }
    }

    task = await db.task.update({
      where: { id: taskId },
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      error: "Gagal update status task",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  revalidatePath(`/organization/${orgId}/tasks`);
  revalidatePath(`/organization/${orgId}/division/${existingTask.divisionId}`);

  return { data: task };
};

export const updateTaskStatus = createSafeAction(UpdateTaskStatus, handler);
