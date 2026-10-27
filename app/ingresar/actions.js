'use server';

import { redirect } from 'next/navigation';
import { login } from '@/lib/auth';

export async function loginAction(_prev, formData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  if (!email || !password) return { error: 'Escribí tu email y tu contraseña.', email };
  if (!(await login(email, password))) {
    return { error: 'El email o la contraseña no coinciden. Revisalos y probá de nuevo.', email };
  }
  redirect('/');
}
