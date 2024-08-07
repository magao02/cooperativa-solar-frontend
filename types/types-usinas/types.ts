import { z } from "zod";

export interface UsinaCreateRequest {
  usuarioResponsavel: number | null;
  nome: string;
  localizacao: string;
  potenciaInstalada: number;
  potenciaNominal: number;
  capacidadeGeracao: number;
}

export const usinaCreateSchema = z.object({
  usuarioResponsavel: z.number(),
  nome: z.string(),
  localizacao: z.string(),
  potenciaInstalada: z.number(),
  potenciaNominal: z.number(),
  capacidadeGeracao: z.number(),
});

export interface EditUsinaRequest {
  usuarioResponsavel: number;
  nome: string;
  potenciaInstalada: number;
  potenciaNominal: number;
  capacidadeGeracao: number;
}

export const editUsinaSchema = z.object({
  usuarioResponsavel: z.number(),
  nome: z.string(),
  localizacao: z.string(),
  potenciaInstalada: z.number(),
  potenciaNominal: z.number(),
  capacidadeGeracao: z.number(),
});