import { NextResponse } from 'next/server';

/**
 * Kontaktní formulář — odesílání přes Resend HTTP API
 *
 * Vyžaduje environment proměnné (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY     — API klíč z https://resend.com (formát "re_xxx")
 *   CONTACT_TO_EMAIL   — kam se má e-mail doručit (např. martinskafoto@gmail.com)
 *   CONTACT_FROM_EMAIL — odesílatel (musí být doména ověřená v Resendu,
 *                        nebo "onboarding@resend.dev" pro testy)
 *
 * Pokud RESEND_API_KEY není nastavený, endpoint vrací 503 a frontend
 * uživateli ukáže fallback (mailto: link). Web tak funguje i bez Resendu.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  package?: string;
  details?: string;
  // honeypot — boti ho vyplní, lidé ne
  website?: string;
}

const PACKAGE_LABELS: Record<string, string> = {
  rodinna: 'Rodinné a portrétní focení',
  newborn: 'Newborn — miminka',
  svatby: 'Svatba',
  tehotenske: 'Těhotenské focení',
  psi: 'Focení pejsků',
  portret: 'Portréty',
  jine: 'Jiné',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Neplatný požadavek.' }, { status: 400 });
  }

  // Honeypot — pokud je vyplněný, tiše předstíráme úspěch
  if (body.website && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const date = (body.date || '').trim();
  const pkgKey = (body.package || '').trim();
  const pkg = PACKAGE_LABELS[pkgKey] || pkgKey || '—';
  const details = (body.details || '').trim();

  // Validace
  if (!name || !email) {
    return NextResponse.json(
      { error: 'Vyplňte prosím jméno a e-mail.' },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Neplatný formát e-mailu.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'martinskafoto@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  // Bez API klíče → frontend dostane 503 a použije mailto: fallback
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'Odesílání e-mailů zatím není nakonfigurováno. Použijte prosím přímý e-mail nebo nás kontaktujte jinak.',
        fallback: true,
      },
      { status: 503 }
    );
  }

  // HTML šablona e-mailu
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #a98d6d; border-bottom: 2px solid #a98d6d; padding-bottom: 0.5rem;">
        Nová poptávka focení
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Jméno:</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold;">E-mail:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Telefon:</td><td>${escapeHtml(phone)}</td></tr>` : ''}
        ${date ? `<tr><td style="padding: 8px 0; font-weight: bold;">Datum focení:</td><td>${escapeHtml(date)}</td></tr>` : ''}
        <tr><td style="padding: 8px 0; font-weight: bold;">Balíček:</td><td>${escapeHtml(pkg)}</td></tr>
      </table>
      ${
        details
          ? `<div style="margin-top: 1.5rem; padding: 1rem; background: #f5efe7; border-radius: 8px;">
               <strong>Další podrobnosti:</strong><br>
               ${escapeHtml(details).replace(/\n/g, '<br>')}
             </div>`
          : ''
      }
      <p style="margin-top: 2rem; font-size: 0.85rem; color: #666;">
        Odesláno z formuláře na majdamartinska.com
      </p>
    </div>
  `;

  const text = [
    `Nová poptávka focení`,
    ``,
    `Jméno: ${name}`,
    `E-mail: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    date ? `Datum focení: ${date}` : null,
    `Balíček: ${pkg}`,
    details ? `\nDalší podrobnosti:\n${details}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Web Majda Martinská <${fromEmail}>`,
        to: [toEmail],
        reply_to: email,
        subject: `Poptávka focení — ${name}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('Resend API error:', res.status, errText);
      return NextResponse.json(
        { error: 'E-mail se nepodařilo odeslat. Zkuste to prosím za chvíli.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Server nedostupný. Zkuste to prosím později.' },
      { status: 500 }
    );
  }
}
