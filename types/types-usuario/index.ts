import { z } from "zod";

export interface FaturaCreateRequest {
  usuario: number;
  dataVencimento: string;
  mesReferencia: string;
  anoReferencia: string;
  consumo: number;
}

export const usinaCreateSchema = z.object({
  usuario: z.number(),
  dataVencimento: z.string(),
  mesReferencia: z.string(),
  anoReferencia: z.string(),
  consumo: z.number(),
});