'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="login__form">
      {state?.error && (
        <p className="login__error" role="alert">
          {state.error}
        </p>
      )}
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="email">Email</label>
        <input className="mfl-input" id="email" name="email" type="email" autoComplete="email" defaultValue={state?.email} required />
      </div>
      <div className="mfl-field">
        <label className="mfl-field__label" htmlFor="password">Contraseña</label>
        <input className="mfl-input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button type="submit" className="mfl-btn mfl-btn--primary" disabled={pending}>
        {pending ? 'Ingresando' : 'Ingresar'}
      </button>
    </form>
  );
}
