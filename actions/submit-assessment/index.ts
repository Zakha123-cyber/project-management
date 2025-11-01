"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { SubmitAssessment } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
    };
  }

  const member = await db.member.findUnique({
    where: { userId },
  });

  if (!member) {
    return {
      error: "Member tidak ditemukan",
    };
  }

  const {
    periodId,
    assesseeId,
    assesseeName,
    assesseeDivisionId,
    hardSkill1,
    hardSkill2,
    hardSkill3,
    hardSkill4,
    hardSkill5,
    hardSkill6,
    hardSkill7,
    softSkill1,
    softSkill2,
    softSkill3,
    softSkill4,
    softSkill5,
    softSkill6,
    softSkill7,
    softSkill8,
    softSkill9,
    softSkill10,
    softSkill11,
    softSkill12,
  } = data;

  // Check if period exists and is active
  const period = await db.assessmentPeriod.findUnique({
    where: { id: periodId },
  });

  if (!period) {
    return {
      error: "Periode penilaian tidak ditemukan",
    };
  }

  if (!period.isActive) {
    return {
      error: "Periode penilaian sudah ditutup",
    };
  }

  // Check if assessing self
  if (assesseeId === userId) {
    return {
      error: "Anda tidak dapat menilai diri sendiri",
    };
  }

  // Check if already assessed this person in this period
  const existingAssessment = await db.assessment.findFirst({
    where: {
      periodId,
      assessorId: userId,
      assesseeId,
    },
  });

  if (existingAssessment) {
    return {
      error: `Anda sudah pernah menilai ${assesseeName} di periode ini`,
    };
  }

  // Calculate averages
  const hardSkills = [hardSkill1, hardSkill2, hardSkill3, hardSkill4, hardSkill5, hardSkill6, hardSkill7];
  const softSkills = [softSkill1, softSkill2, softSkill3, softSkill4, softSkill5, softSkill6, softSkill7, softSkill8, softSkill9, softSkill10, softSkill11, softSkill12];

  const averageHardSkill = hardSkills.reduce((a, b) => a + b, 0) / 7;
  const averageSoftSkill = softSkills.reduce((a, b) => a + b, 0) / 12;
  const averageTotal = (averageHardSkill + averageSoftSkill) / 2;

  let assessment;

  try {
    assessment = await db.assessment.create({
      data: {
        periodId,
        assessorId: userId,
        assessorName: member.name,
        assesseeId,
        assesseeName,
        assesseeDivisionId,

        hardSkill1,
        hardSkill2,
        hardSkill3,
        hardSkill4,
        hardSkill5,
        hardSkill6,
        hardSkill7,
        softSkill1,
        softSkill2,
        softSkill3,
        softSkill4,
        softSkill5,
        softSkill6,
        softSkill7,
        softSkill8,
        softSkill9,
        softSkill10,
        softSkill11,
        softSkill12,

        averageHardSkill,
        averageSoftSkill,
        averageTotal,
      },
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return {
      error: "Gagal menyimpan penilaian",
    };
  }

  revalidatePath(`/organization/${orgId}/penilaian`);

  return { data: assessment };
};

export const submitAssessment = createSafeAction(SubmitAssessment, handler);
