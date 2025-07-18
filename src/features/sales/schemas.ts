import { z } from 'zod';

export const saleSchema = z.object({
  platform: z.string().min(1, 'Plataforma obrigatória'),
  product: z.string().min(1, 'Produto obrigatório'),
  status: z.string().min(1, 'Status obrigatório'),
  date: z.string().min(1, 'Data obrigatória'),
  time: z.string().min(1, 'Hora obrigatória'),
  price: z.number().min(0, 'Preço obrigatório'),
  receivedValue: z.number().min(0, 'Valor recebido obrigatório'),
});

export type SaleFormData = z.infer<typeof saleSchema>;
