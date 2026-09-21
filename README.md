# PayFlow

PayFlow is a privacy-first SaaS for freelancers and solo service businesses to manage invoices and payment follow-ups.

## Product principle
Get paid without the awkward follow-up.

## Security baseline
- No real client data is included in the repository.
- Client records must be private and isolated per authenticated account.
- No bank credentials are stored.
- Secrets belong in environment variables, never source code.
- Billing and payment integrations are designed to be added behind authenticated server-side boundaries.

## Local development
```bash
npm install
npm run dev
```
