import { fullStackEngineering } from "./full-stack";
import { machineLearning } from "./machine-learning";
import { preTechEngineering } from "./pretech-engineering";

export const courses = {
  "machine-learning": machineLearning,
  "full-stack-engineering": fullStackEngineering,
  "pretech-engineering": preTechEngineering,
} as const;

export type CourseSlug = keyof typeof courses;

export type Course = (typeof courses)[CourseSlug];
