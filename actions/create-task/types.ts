import { z } from "zod";
import { CreateTask } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof CreateTask>;
export type ReturnType = ActionState<InputType, any>;
