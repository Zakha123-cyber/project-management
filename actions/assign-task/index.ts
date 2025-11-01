"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { AssignTask } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { taskId, assignedTo } = data;

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

  // Only ADMIN and COORDINATOR can assign tasks
  if (member.role === "STAFF") {
    return {
      error: "Anda tidak memiliki akses untuk assign task",
    };
  }

  // COORDINATOR can only assign tasks in their division
  if (member.role === "COORDINATOR" && member.divisionId !== existingTask.divisionId) {
    return {
      error: "Anda hanya bisa assign task di divisi Anda sendiri",
    };
  }

  let task;

  try {
    // Get assigned member name if assigning
    let assignedToName = null;
    if (assignedTo) {
      const assignedMember = await db.member.findUnique({
        where: { userId: assignedTo },
      });

      if (!assignedMember) {
        return {
          error: "Member yang dipilih tidak ditemukan",
        };
      }

      // Check if assigned member is in the same division
      if (assignedMember.divisionId !== existingTask.divisionId) {
        return {
          error: "Member harus berada di divisi yang sama dengan task",
        };
      }

      assignedToName = assignedMember.name;
    }

    task = await db.task.update({
      where: { id: taskId },
      data: {
        assignedTo,
        assignedToName,
      },
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    return {
      error: "Gagal assign task",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  revalidatePath(`/organization/${orgId}/tasks`);
  revalidatePath(`/organization/${orgId}/division/${existingTask.divisionId}`);

  return { data: task };
};

export const assignTask = createSafeAction(AssignTask, handler);
