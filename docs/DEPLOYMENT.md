# Production Deployment

This application is designed to run on Vercel with `main` as the production branch.

## 1. Import the repository

Import:

```text
cagataysntrk/upcytech-digital-card
```

Framework preset: Next.js.

## 2. Production environment

Required:

```text
NEXT_PUBLIC_SITE_URL=https://card.upcytech.com
```

Optional company social:

```text
NEXT_PUBLIC_UPCYTECH_INSTAGRAM=
```

Founder values are listed in `.env.example`. Phone, email and unverified personal social links are intentionally kept out of Git history.

Add values to **Production** and, if preview testing is required, to **Preview** separately.

## 3. First deploy

Deploy from `main`.

Before attaching the custom domain, the generated Vercel URL can be used to confirm that:

```text
/api/health
/cagatay
/enes
/hulusi
/harun
/hamza
```

all respond successfully.

## 4. Attach the production domain

Add:

```text
card.upcytech.com
```

to the Vercel project.

Use the exact DNS record Vercel displays for the subdomain. Do not guess or hard-code a DNS target before Vercel has assigned the project domain.

After DNS and TLS are active, verify:

```text
https://card.upcytech.com/api/health
```

## 5. Final acceptance

Run these checks on real devices:

1. Scan every founder QR from an iPhone camera.
2. Scan every founder QR from an Android camera.
3. Confirm the expected founder profile opens.
4. Tap **Rehbere Ekle**.
5. Confirm name, company, title, office address, phone, email and available social links appear in the native contact sheet.
6. Save the contact and reopen it from Contacts.
7. Test phone and email actions.
8. Test native share.
9. Download PNG and SVG QR from the profile.
10. Scan the downloaded QR again.

The QR target is the stable `card.upcytech.com/<slug>` URL. Phone, email and social changes do not require printing a new QR.

## 6. Release gate

Do not treat production as complete until:

- GitHub Actions is green on the production commit.
- Vercel production deployment is healthy.
- `card.upcytech.com` has a valid certificate.
- All five QR codes decode to the expected stable URL.
- iOS and Android vCard import have both been checked.
- Real founder contact values have been supplied and verified.
