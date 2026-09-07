import seed from "@/data/db.json";
import type { Task } from "@/domain/types";

export const initialTasks = seed.tasks as Task[];
