import { z } from "zod";

export const printerStateSchema = z.object({
  text: z.string(),
  flags: z.object({
    operational: z.boolean(),
    printing: z.boolean(),
    paused: z.boolean(),
    ready: z.boolean(),
    error: z.boolean(),
    closedOrError: z.boolean(),
  }),
});

export const temperatureDataSchema = z.object({
  actual: z.number(),
  target: z.number(),
  offset: z.number().optional(),
});

export const temperatureSchema = z.object({
  tool0: temperatureDataSchema.optional(),
  bed: temperatureDataSchema.optional(),
});

export const jobProgressSchema = z.object({
  completion: z.number().nullable(),
  filepos: z.number().nullable(),
  printTime: z.number().nullable(),
  printTimeLeft: z.number().nullable(),
});

export const jobFileSchema = z.object({
  name: z.string().nullable(),
  path: z.string().nullable(),
  display: z.string().nullable(),
  origin: z.string().nullable(),
  size: z.number().nullable(),
  date: z.number().nullable(),
});

export const jobSchema = z.object({
  file: jobFileSchema,
  estimatedPrintTime: z.number().nullable(),
  lastPrintTime: z.number().nullable(),
  filament: z.record(z.object({
    length: z.number().nullable(),
    volume: z.number().nullable(),
  })).nullable(),
});

export const fileSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(["machinecode", "folder"]),
  typePath: z.array(z.string()),
  hash: z.string().optional(),
  size: z.number().optional(),
  date: z.number().optional(),
  origin: z.string().optional(),
  refs: z.object({
    resource: z.string().optional(),
    download: z.string().optional(),
  }).optional(),
  gcodeAnalysis: z.object({
    estimatedPrintTime: z.number().optional(),
    filament: z.record(z.object({
      length: z.number().optional(),
      volume: z.number().optional(),
    })).optional(),
  }).optional(),
});

export const filesResponseSchema = z.object({
  files: z.array(fileSchema),
  free: z.number().optional(),
  total: z.number().optional(),
});

export const connectionSettingsSchema = z.object({
  serverUrl: z.string().url(),
  apiKey: z.string().min(1),
});

export const printerStatusSchema = z.object({
  state: printerStateSchema,
  temperature: temperatureSchema,
});

export type PrinterState = z.infer<typeof printerStateSchema>;
export type TemperatureData = z.infer<typeof temperatureDataSchema>;
export type Temperature = z.infer<typeof temperatureSchema>;
export type JobProgress = z.infer<typeof jobProgressSchema>;
export type Job = z.infer<typeof jobSchema>;
export type File = z.infer<typeof fileSchema>;
export type FilesResponse = z.infer<typeof filesResponseSchema>;
export type ConnectionSettings = z.infer<typeof connectionSettingsSchema>;
export type PrinterStatus = z.infer<typeof printerStatusSchema>;
