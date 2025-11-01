import { z } from "zod";
import { AssessmentPeriod } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { TogglePeriod } from "./schema";

export type InputType = z.infer<typeof TogglePeriod>;
export type ReturnType = ActionState<InputType, AssessmentPeriod>;
