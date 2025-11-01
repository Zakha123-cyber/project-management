import { z } from "zod";
import { AddTaskNote } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof AddTaskNote>;
export type ReturnType = ActionState<InputType, any>;
