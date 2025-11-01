"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateTask } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, ...updateData } = data;

  // Get existing task
  const existingTask = await db.task.findUnique({
    where: { id },
    include: { division: true },
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

  // Permission check
  const isAdmin = member.role === "ADMIN";
  const isCoordinator = member.role === "COORDINATOR" && member.divisionId === existingTask.divisionId;
  const isAssignee = member.userId === existingTask.assignedTo;

  // STAFF can only update status of their own tasks
  if (member.role === "STAFF") {
    if (!isAssignee) {
      return {
        error: "Anda hanya bisa update task yang di-assign ke Anda",
      };
    }
    // Staff can only update status and progress
    const allowedFields = ["status", "progress"];
    const hasUnallowedField = Object.keys(updateData).some((key) => !allowedFields.includes(key));
    if (hasUnallowedField) {
      return {
        error: "Anda hanya bisa update status task Anda sendiri",
      };
    }
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
    const preparedData: any = { ...updateData };

    // Convert deadline string to Date if exists
    if (updateData.deadline) {
      preparedData.deadline = new Date(updateData.deadline);
    }

    // Get assigned member name if assignedTo is being updated
    if (updateData.assignedTo) {
      const assignedMember = await db.member.findUnique({
        where: { userId: updateData.assignedTo },
      });
      preparedData.assignedToName = assignedMember?.name || null;
    }

    task = await db.task.update({
      where: { id },
      data: preparedData,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      error: "Gagal update task",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  revalidatePath(`/organization/${orgId}/division/${existingTask.divisionId}`);

  return { data: task };
};

export const updateTask = createSafeAction(UpdateTask, handler);
