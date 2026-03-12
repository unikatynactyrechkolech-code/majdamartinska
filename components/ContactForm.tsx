'use client';

import { FormEvent, useCallback } from 'react';

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
        <label htmlFor="name">Jméno</label>
        <input type="text" id="name" name="name" required placeholder="Vaše jméno" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="vas@email.cz" />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Telefon</label>
        <input type="tel" id="phone" name="phone" placeholder="+420 ..." />
      </div>
      <div className="form-group">
        <label htmlFor="date">Datum focení</label>
        <input type="text" id="date" name="date" placeholder="Pokud máš návrh" />
      </div>
      <div className="form-group">
        <label htmlFor="package">Zvolený balíček</label>
        <select id="package" name="package">
          <option value="">— Vyberte —</option>
          <option value="rodinna">Rodinné a portrétní focení</option>
          <option value="newborn">Newborn — miminka</option>
          <option value="svatby">Svatba</option>
          <option value="tehotenske">Těhotenské focení</option>
          <option value="psi">Focení pejsků</option>
          <option value="portret">Portréty</option>
          <option value="jine">Jiné</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="details">Další podrobnosti</label>
        <textarea id="details" name="details" placeholder="Napište cokoliv, co bych měla vědět..." />
      </div>
      <button type="submit" className="btn btn-primary">Odeslat poptávku</button>
    </form>
  );
}
