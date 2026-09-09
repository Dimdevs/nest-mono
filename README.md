# NestJS Monolith Base (Starter)
See docs folder or inline comments. Quick start:

```bash
cp .env.example .env
docker compose up -d
npm i
npm run prisma:gen
npm run prisma:migrate
npm run seed
npm run dev
```

hallo

- Swagger: http://localhost:9099/docs
- Health:  http://localhost:9099/health
- WS (public): `io('/realtime')`
- WS (secure namespace with JWT): `io('/secure', { auth: { token: '<JWT>' } })`

## Ledger Transfer
POST /ledger/transfer (Bearer token required)
```json
{
  "from_account_id": "<uuid>",
  "to_account_id": "<uuid>",
  "amount_cents": 1000,
  "reference": "optional-unique-ref"
}
```
Idempotent by `reference`, safe by row locks + single-connection transaction.
