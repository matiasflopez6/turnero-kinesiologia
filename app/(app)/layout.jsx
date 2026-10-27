import Shell from '@/components/Shell';
import { requireUser } from '@/lib/auth';
import { logoutAction } from './actions';

export default async function AppLayout({ children }) {
  const user = await requireUser();
  return (
    <Shell user={user} clinicName={process.env.CLINIC_NAME || 'Tu consultorio'} logoutAction={logoutAction}>
      {children}
    </Shell>
  );
}
