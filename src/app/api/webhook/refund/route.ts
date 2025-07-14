import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Interface para o body da requisição
interface RefundWebhookBody {
  userId: string;
  date: string;
  saleId?: string; // ID da venda original (opcional)
  productId: string;
  platformId: string;
  quantity: number;
  refundAmount: number;
  reason?: string;
}



export async function POST(request: NextRequest) {
  try {
    // Criar cliente Supabase com service role key para bypass RLS (lazy-load)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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
    const body: RefundWebhookBody = await request.json();

    // Validar campos obrigatórios
    const requiredFields = ['userId', 'date', 'productId', 'platformId', 'quantity', 'refundAmount'];
    for (const field of requiredFields) {
      if (!body[field as keyof RefundWebhookBody]) {
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

    if (typeof body.refundAmount !== 'number' || body.refundAmount < 0) {
      return NextResponse.json(
        { error: 'refundAmount must be a non-negative number' },
        { status: 400 }
      );
    }

    // 3. Inserir no Supabase (tabela refunds)
    const { data, error } = await supabaseAdmin
      .from('refunds')
      .insert([
        {
          user_id: body.userId,
          date: body.date,
          sale_id: body.saleId || null,
          product: body.productId,
          platform: body.platformId,
          quantity: body.quantity,
          amount: body.refundAmount,
          reason: body.reason || 'Refund requested',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to insert refund into database' },
        { status: 500 }
      );
    }

    // 4. Se houver saleId, atualizar a venda original com o reembolso
    if (body.saleId) {
      try {
        // Buscar a venda original
        const { data: saleData, error: saleError } = await supabaseAdmin
          .from('sales')
          .select('refunds')
          .eq('id', body.saleId)
          .single();

        if (!saleError && saleData) {
          // Atualizar o campo refunds da venda
          const currentRefunds = saleData.refunds || 0;
          const newRefunds = currentRefunds + body.refundAmount;

          await supabaseAdmin
            .from('sales')
            .update({ 
              refunds: newRefunds,
              updated_at: new Date().toISOString()
            })
            .eq('id', body.saleId);
        }
      } catch (updateError) {
        console.error('Error updating sale refunds:', updateError);
        // Não falhar o webhook se a atualização da venda falhar
      }
    }

    // 5. Retornar sucesso
    return NextResponse.json(
      { 
        success: true, 
        message: 'Refund recorded successfully',
        refundId: data.id 
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