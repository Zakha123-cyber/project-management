import { z } from "zod";
import { AssignTask } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof AssignTask>;
export type ReturnType = ActionState<InputType, any>;
