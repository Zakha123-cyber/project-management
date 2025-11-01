import { z } from "zod";
import { Assessment } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { SubmitAssessment } from "./schema";

export type InputType = z.infer<typeof SubmitAssessment>;
export type ReturnType = ActionState<InputType, Assessment>;
