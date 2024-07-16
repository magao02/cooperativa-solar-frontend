import { z } from "zod";

export interface UserCreateRequest {
  nome: string;
  email: string;
  uc: string;
  tipoConta: string;
  endereco: string;
  consumoMedio: number;
  data_nascimento: string;
  cpfcnpj: string;
  telefone: string;
  usina: number;
  plano: string;
  tarifa: string;
}

export const userCreateSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  uc: z.string(),
  tipoConta: z.string(),
  endereco: z.string(),
  consumoMedio: z.number(),
  data_nascimento: z.string(),
  cpfcnpj: z.string(),
  telefone: z.string(),
  usina: z.number(),
  plano: z.string(),
  tarifa: z.string()
})