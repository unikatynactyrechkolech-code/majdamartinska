'use client';

import { FormEvent, useCallback } from 'react';
import { EditableText } from '@/components/EditableText';
import { useLang } from '@/contexts/LanguageContext';

export function ContactForm() {
  const { t } = useLang();
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent('Poptávka focení');
    const body = encodeURIComponent(
      `Jméno: ${data.get('name')}\nEmail: ${data.get('email')}\nTelefon: ${data.get('phone')}\nDatum: ${data.get('date')}\nBalíček: ${data.get('package')}\nPodrobnosti: ${data.get('details')}`
    );
    window.location.href = `mailto:martinskafoto@gmail.com?subject=${subject}&body=${body}`;
  }, []);

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name"><EditableText sectionId="form.label.name" defaultValue="Jméno" as="span" /></label>
        <input type="text" id="name" name="name" required placeholder="Vaše jméno" />
      </div>
      <div className="form-group">
        <label htmlFor="email"><EditableText sectionId="form.label.email" defaultValue="Email" as="span" /></label>
        <input type="email" id="email" name="email" required placeholder="vas@email.cz" />
      </div>
      <div className="form-group">
        <label htmlFor="phone"><EditableText sectionId="form.label.phone" defaultValue="Telefon" as="span" /></label>
        <input type="tel" id="phone" name="phone" placeholder="+420 ..." />
      </div>
      <div className="form-group">
        <label htmlFor="date"><EditableText sectionId="form.label.date" defaultValue="Datum focení" as="span" /></label>
        <input type="text" id="date" name="date" placeholder="Pokud máš návrh" />
      </div>
      <div className="form-group">
        <label htmlFor="package"><EditableText sectionId="form.label.package" defaultValue="Zvolený balíček" as="span" /></label>
        <select id="package" name="package">
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
        <label htmlFor="details"><EditableText sectionId="form.label.details" defaultValue="Další podrobnosti" as="span" /></label>
        <textarea id="details" name="details" placeholder="Napište cokoliv, co bych měla vědět..." />
      </div>
      <button type="submit" className="btn btn-primary">
        <EditableText sectionId="form.btn.submit" defaultValue="Odeslat poptávku" as="span" />
      </button>
    </form>
  );
}
