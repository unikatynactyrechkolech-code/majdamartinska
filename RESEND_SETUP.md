# Resend — nastavení odesílání kontaktního formuláře

Kontaktní formulář na `/kontakt` posílá zprávy přes [Resend](https://resend.com).
Backend endpoint: `app/api/contact/route.ts`.

## 1. Vytvoření účtu

1. Registrace: <https://resend.com/signup>
2. (Volitelné) Ověření vlastní domény v sekci **Domains** — pro produkci doporučeno
   (jinak musíš jako odesílatele použít `onboarding@resend.dev`, což jde jen na testovací
   adresy).
3. Vygeneruj API klíč v sekci **API Keys** (formát `re_xxxxxxxxxxxxxxxxx`).

## 2. Environment proměnné na Vercelu

V projektu na Vercelu → **Settings → Environment Variables** přidej:

| Klíč | Hodnota | Příklad |
|---|---|---|
| `RESEND_API_KEY` | API klíč z Resendu | `re_AbCdEf123…` |
| `CONTACT_TO_EMAIL` | Kam se mají poptávky chodit | `martinskafoto@gmail.com` |
| `CONTACT_FROM_EMAIL` | Odesílatel (musí být v ověřené doméně) | `formular@majdamartinska.com` |

> **Pozor:** dokud nemáš ověřenou doménu, nech `CONTACT_FROM_EMAIL` nevyplněný — endpoint
> automaticky použije `onboarding@resend.dev`. To ale chodí jen na e-mail účtu, kterým
> jsi registrovaný v Resendu.

Po uložení je třeba **redeployovat** projekt (Vercel → Deployments → … → Redeploy).

## 3. Lokální vývoj

V `majda-web/.env.local` přidej:

```
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_TO_EMAIL=tvuj@email.cz
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

Soubor `.env.local` je v `.gitignore`, takže se nikdy neposílá do gitu.

## 4. Chování bez API klíče

Pokud `RESEND_API_KEY` není nastavený:
- Endpoint vrací HTTP 503 a flag `fallback: true`.
- Frontend uživateli automaticky **otevře `mailto:` odkaz** s předvyplněnými údaji,
  takže formulář **funguje i bez Resendu** (jen méně elegantně).
- Web se nerozbije ani v buildu, ani v runtime.

## 5. Testování

```bash
# Lokálně
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","details":"ahoj"}'
```

- `200 { "ok": true }` → e-mail odeslán
- `400 { "error": "..." }` → validační chyba
- `503 { "error": "...", "fallback": true }` → API klíč chybí
- `502 { "error": "..." }` → Resend selhalo (zkontroluj logy)

## 6. Anti-spam

Endpoint má vestavěný **honeypot** (skryté pole `website`). Boti, kteří vyplní všechna
pole, dostanou tichou 200 odpověď, ale e-mail se neodešle.
