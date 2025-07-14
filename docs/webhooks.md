# Webhooks API - Finestra v2

Esta documentação descreve os endpoints de webhook disponíveis para integração externa.

## Configuração

### Variáveis de Ambiente Necessárias

```env
WEBHOOK_SECRET=finestra_webhook_secret_2024
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### Headers Obrigatórios

Todos os webhooks requerem o header de autenticação:

```
x-webhook-secret: finestra_webhook_secret_2024
```

## Endpoints

### 1. Webhook de Vendas

**POST** `/api/webhook/sale`

Registra uma nova venda no sistema.

#### Request Body

```json
{
  "userId": "user_123",
  "date": "2024-01-15",
  "productId": "Produto A",
  "platformId": "Shopee",
  "quantity": 2,
  "netAmount": 150.00
}
```

#### Campos Obrigatórios

- `userId` (string): ID do usuário
- `date` (string): Data da venda (YYYY-MM-DD)
- `productId` (string): Nome/ID do produto
- `platformId` (string): Nome/ID da plataforma
- `quantity` (number): Quantidade vendida (deve ser > 0)
- `netAmount` (number): Valor líquido da venda (deve ser >= 0)

#### Response

**Sucesso (201):**
```json
{
  "success": true,
  "message": "Sale recorded successfully",
  "saleId": "uuid-da-venda"
}
```

**Erro (400/401/500):**
```json
{
  "error": "Descrição do erro"
}
```

### 2. Webhook de Reembolsos

**POST** `/api/webhook/refund`

Registra um reembolso no sistema.

#### Request Body

```json
{
  "userId": "user_123",
  "date": "2024-01-15",
  "saleId": "uuid-da-venda-original",
  "productId": "Produto A",
  "platformId": "Shopee",
  "quantity": 1,
  "refundAmount": 75.00,
  "reason": "Produto com defeito"
}
```

#### Campos Obrigatórios

- `userId` (string): ID do usuário
- `date` (string): Data do reembolso (YYYY-MM-DD)
- `productId` (string): Nome/ID do produto
- `platformId` (string): Nome/ID da plataforma
- `quantity` (number): Quantidade reembolsada (deve ser > 0)
- `refundAmount` (number): Valor do reembolso (deve ser >= 0)

#### Campos Opcionais

- `saleId` (string): ID da venda original (para vincular o reembolso)
- `reason` (string): Motivo do reembolso

#### Response

**Sucesso (201):**
```json
{
  "success": true,
  "message": "Refund recorded successfully",
  "refundId": "uuid-do-reembolso"
}
```

**Erro (400/401/500):**
```json
{
  "error": "Descrição do erro"
}
```

## Testes

### Teste de Venda via cURL

```bash
curl -X POST http://localhost:3000/api/webhook/sale \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: finestra_webhook_secret_2024" \
  -d '{
    "userId": "user_123",
    "date": "2024-01-15",
    "productId": "Produto A",
    "platformId": "Shopee",
    "quantity": 2,
    "netAmount": 150.00
  }'
```

### Teste de Reembolso via cURL

```bash
curl -X POST http://localhost:3000/api/webhook/refund \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: finestra_webhook_secret_2024" \
  -d '{
    "userId": "user_123",
    "date": "2024-01-15",
    "saleId": "uuid-da-venda-original",
    "productId": "Produto A",
    "platformId": "Shopee",
    "quantity": 1,
    "refundAmount": 75.00,
    "reason": "Produto com defeito"
  }'
```

## Códigos de Status

- `200/201`: Sucesso
- `400`: Bad Request (dados inválidos)
- `401`: Unauthorized (webhook secret inválido)
- `500`: Internal Server Error

## Segurança

- Todos os webhooks requerem autenticação via `x-webhook-secret`
- Os webhooks usam a `SUPABASE_SERVICE_ROLE_KEY` para bypass RLS
- Validação rigorosa de tipos e campos obrigatórios
- Logs de erro para debugging 