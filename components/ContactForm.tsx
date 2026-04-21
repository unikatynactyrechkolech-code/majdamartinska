'use client';

import { FormEvent, useCallback, useState } from 'react';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';

type Status = 'idle' | 'sending' | 'success' | 'error';

const FALLBACK_EMAIL = 'martinskafoto@gmail.com';

export function ContactForm() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const data = new FormData(form);

      const payload = {
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        phone: String(data.get('phone') || ''),
        date: String(data.get('date') || ''),
        package: String(data.get('package') || ''),
        details: String(data.get('details') || ''),
        // Honeypot — skryté pole pro boty
        website: String(data.get('website') || ''),
      };

      setStatus('sending');
      setErrorMsg('');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setStatus('success');
          form.reset();
          return;
        }

        // 503 = Resend není nakonfigurovaný → fallback na mailto:
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
          fallback?: boolean;
        };

        if (res.status === 503 || errBody.fallback) {
          // Otevři uživateli mailto: jako záložní řešení
          const subject = encodeURIComponent(t('Poptávka focení'));
          const body = encodeURIComponent(
            `${t('Jméno')}: ${payload.name}\n` +
              `Email: ${payload.email}\n` +
              `${t('Telefon')}: ${payload.phone}\n` +
              `${t('Datum focení')}: ${payload.date}\n` +
              `${t('Zvolený balíček')}: ${payload.package}\n` +
              `${t('Další podrobnosti')}: ${payload.details}`
          );
          window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
          setStatus('idle');
          return;
        }

        setStatus('error');
        setErrorMsg(errBody.error || t('Něco se pokazilo. Zkuste to prosím znovu.'));
      } catch {
        setStatus('error');
        setErrorMsg(t('Síťová chyba. Zkontrolujte připojení a zkuste to znovu.'));
      }
    },
    [t]
  );

  const isSending = status === 'sending';

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">
          <EditableText sectionId="form.label.name" defaultValue="Jméno" as="span" />
        </label>
        <input type="text" id="name" name="name" required placeholder={t('Vaše jméno')} disabled={isSending} />
      </div>
      <div className="form-group">
        <label htmlFor="email">
          <EditableText sectionId="form.label.email" defaultValue="Email" as="span" />
        </label>
        <input type="email" id="email" name="email" required placeholder={t('vas@email.cz')} disabled={isSending} />
      </div>
      <div className="form-group">
        <label htmlFor="phone">
          <EditableText sectionId="form.label.phone" defaultValue="Telefon" as="span" />
        </label>
        <input type="tel" id="phone" name="phone" placeholder="+420 ..." disabled={isSending} />
      </div>
      <div className="form-group">
        <label htmlFor="date">
          <EditableText sectionId="form.label.date" defaultValue="Datum focení" as="span" />
        </label>
        <input type="text" id="date" name="date" placeholder={t('Pokud máš návrh')} disabled={isSending} />
      </div>
      <div className="form-group">
        <label htmlFor="package">
          <EditableText sectionId="form.label.package" defaultValue="Zvolený balíček" as="span" />
        </label>
        <select id="package" name="package" disabled={isSending}>
          <option value="">{t('— Vyberte —')}</option>
          <option value="rodinna">{t('Rodinné a portrétní focení')}</option>
          <option value="newborn">{t('Newborn — miminka')}</option>
          <option value="svatby">{t('Svatba')}</option>
          <option value="tehotenske">{t('Těhotenské focení')}</option>
          <option value="psi">{t('Focení pejsků')}</option>
          <option value="portret">{t('Portréty')}</option>
          <option value="jine">{t('Jiné')}</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="details">
          <EditableText sectionId="form.label.details" defaultValue="Další podrobnosti" as="span" />
        </label>
        <textarea id="details" name="details" placeholder={t('Napište cokoliv, co bych měla vědět...')} disabled={isSending} />
      </div>

      {/* Honeypot — skryté pole pro boty */}
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'success' && (
        <div className="form-message form-message-success" role="status">
          ✅ {t('Děkuji! Vaše zpráva byla odeslána, ozvu se co nejdříve.')}
        </div>
      )}
      {status === 'error' && (
        <div className="form-message form-message-error" role="alert">
          ❌ {errorMsg}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={isSending}>
        {isSending ? (
          <span>{t('Odesílám…')}</span>
        ) : (
          <EditableText sectionId="form.btn.submit" defaultValue="Odeslat poptávku" as="span" />
        )}
      </button>
    </form>
  );
}
