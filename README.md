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


## Security architecture

PayFlow treats account isolation as a product requirement.

- Authentication is handled by Clerk.
- Every private request resolves the authenticated Clerk user on the server.
- A workspace is uniquely owned by one authenticated user in the current MVP.
- Clients, invoices, follow-ups, and payments carry a workspace boundary.
- Server-side data access must derive ownership from the authenticated session, never from an arbitrary browser-supplied workspace ID.
- Database credentials and authentication secrets stay in environment variables.
- No real customer data belongs in source control.
- Before production launch, authorization tests must cover cross-account reads, updates, deletes, ID enumeration, and unauthenticated API access.

The security badge in the product is intentionally descriptive rather than a certification claim.
