import { z } from 'zod';

export const expenseSchema = z.object({
  account: z.string().min(1, 'Conta obrigatória'),
  group: z.string().min(1, 'Grupo obrigatório'),
  subgroup: z.string().min(1, 'Subgrupo obrigatório'),
  value: z.number().min(0.01, 'Valor obrigatório'),
  interest: z.number().min(0).optional(),
  dueDate: z.string().min(1, 'Data de vencimento obrigatória'),
  paymentDate: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>; 