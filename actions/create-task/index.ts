"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateTask } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
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

  // Only ADMIN and COORDINATOR can create tasks
  if (member.role === "STAFF") {
    return {
      error: "Anda tidak memiliki akses untuk membuat task",
    };
  }

  // If COORDINATOR, can only create task for their division
  if (member.role === "COORDINATOR" && member.divisionId !== data.divisionId) {
    return {
      error: "Anda hanya bisa membuat task untuk divisi Anda sendiri",
    };
  }

  const { title, description, deadline, priority, divisionId, assignedTo } = data;

  let task;

  try {
    // Get assigned member name if exists
    let assignedToName = null;
    if (assignedTo) {
      const assignedMember = await db.member.findUnique({
        where: { userId: assignedTo },
      });
      assignedToName = assignedMember?.name || null;
    }

    task = await db.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        priority,
        divisionId,
        assignedTo,
        assignedToName,
        createdBy: userId,
        createdByName: user.firstName + " " + user.lastName,
      },
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      error: "Gagal membuat task",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  revalidatePath(`/organization/${orgId}/division/${divisionId}`);

  return { data: task };
};

export const createTask = createSafeAction(CreateTask, handler);
