import { z } from "zod";
import { UpdateTaskStatus } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateTaskStatus>;
export type ReturnType = ActionState<InputType, any>;
