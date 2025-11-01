import { z } from "zod";

export const SubmitAssessment = z.object({
  periodId: z.string(),
  assesseeId: z.string(),
  assesseeName: z.string(),
  assesseeDivisionId: z.string(),
  
  // Hard Skills (1-5)
  hardSkill1: z.number().min(1).max(5),
  hardSkill2: z.number().min(1).max(5),
  hardSkill3: z.number().min(1).max(5),
  hardSkill4: z.number().min(1).max(5),
  hardSkill5: z.number().min(1).max(5),
  hardSkill6: z.number().min(1).max(5),
  hardSkill7: z.number().min(1).max(5),
  
  // Soft Skills (1-5)
  softSkill1: z.number().min(1).max(5),
  softSkill2: z.number().min(1).max(5),
  softSkill3: z.number().min(1).max(5),
  softSkill4: z.number().min(1).max(5),
  softSkill5: z.number().min(1).max(5),
  softSkill6: z.number().min(1).max(5),
  softSkill7: z.number().min(1).max(5),
  softSkill8: z.number().min(1).max(5),
  softSkill9: z.number().min(1).max(5),
  softSkill10: z.number().min(1).max(5),
  softSkill11: z.number().min(1).max(5),
  softSkill12: z.number().min(1).max(5),
});
