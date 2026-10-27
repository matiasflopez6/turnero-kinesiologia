import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import { currentUser } from '@/lib/auth';
import LoginForm from './LoginForm';

export const metadata = { title: 'Ingresar' };

export default async function IngresarPage() {
  if (await currentUser()) redirect('/');
  return (
    <main className="login">
      <div className="mfl-card login__card">
        <Logo />
        <div>
          <h1 className="heading">Ingresá a tu consultorio</h1>
          <p className="muted">{process.env.CLINIC_NAME || 'Tu consultorio'}</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
