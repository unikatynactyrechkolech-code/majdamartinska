'use client';

import { FormEvent, useCallback } from 'react';
import { EditableText } from '@/components/EditableText';

export function ContactForm() {
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
          <option value=""><EditableText sectionId="form.option.default" defaultValue="— Vyberte —" as="span" /></option>
          <option value="rodinna"><EditableText sectionId="form.option.rodinna" defaultValue="Rodinné a portrétní focení" as="span" /></option>
          <option value="newborn"><EditableText sectionId="form.option.newborn" defaultValue="Newborn — miminka" as="span" /></option>
          <option value="svatby"><EditableText sectionId="form.option.svatby" defaultValue="Svatba" as="span" /></option>
          <option value="tehotenske"><EditableText sectionId="form.option.tehotenske" defaultValue="Těhotenské focení" as="span" /></option>
          <option value="psi"><EditableText sectionId="form.option.psi" defaultValue="Focení pejsků" as="span" /></option>
          <option value="portret"><EditableText sectionId="form.option.portret" defaultValue="Portréty" as="span" /></option>
          <option value="jine"><EditableText sectionId="form.option.jine" defaultValue="Jiné" as="span" /></option>
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
