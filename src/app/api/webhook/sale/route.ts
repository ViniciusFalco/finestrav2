import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Interface para o body da requisição
interface SaleWebhookBody {
  userId: string;
  date: string;
  productId: string;
  platformId: string;
  quantity: number;
  netAmount: number;
}

// Criar cliente Supabase com service role key para bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. Validar webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid webhook secret' },
        { status: 401 }
      );
    }

    // 2. Validar e extrair body
    const body: SaleWebhookBody = await request.json();

    // Validar campos obrigatórios
    const requiredFields = ['userId', 'date', 'productId', 'platformId', 'quantity', 'netAmount'];
    for (const field of requiredFields) {
      if (!body[field as keyof SaleWebhookBody]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validar tipos de dados
    if (typeof body.quantity !== 'number' || body.quantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof body.netAmount !== 'number' || body.netAmount < 0) {
      return NextResponse.json(
        { error: 'netAmount must be a non-negative number' },
        { status: 400 }
      );
    }

    // 3. Inserir no Supabase
    const { data, error } = await supabaseAdmin
      .from('sales')
      .insert([
        {
          user_id: body.userId,
          date: body.date,
          product: body.productId, // Assumindo que productId é o nome do produto
          platform: body.platformId, // Assumindo que platformId é o nome da plataforma
          quantity: body.quantity,
          amount: body.netAmount,
          refunds: 0, // Valor padrão para reembolsos
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to insert sale into database' },
        { status: 500 }
      );
    }

    // 4. Retornar sucesso
    return NextResponse.json(
      { 
        success: true, 
        message: 'Sale recorded successfully',
        saleId: data.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 