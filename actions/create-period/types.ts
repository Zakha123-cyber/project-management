import { z } from "zod";
import { AssessmentPeriod } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreatePeriod } from "./schema";

export type InputType = z.infer<typeof CreatePeriod>;
export type ReturnType = ActionState<InputType, AssessmentPeriod>;
