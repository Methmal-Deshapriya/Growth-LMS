import { fullStackEngineering } from "./full-stack";
import { machineLearning } from "./machine-learning";

export const courses = {
  "machine-learning": machineLearning,
  "full-stack-engineering": fullStackEngineering,
} as const;

export type CourseSlug = keyof typeof courses;

export type Course = (typeof courses)[CourseSlug];
