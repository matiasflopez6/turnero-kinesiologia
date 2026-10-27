'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CalendarDays, House, LogOut, Menu, Users, Wallet, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/', label: 'Inicio', icon: House },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/pacientes', label: 'Pacientes', icon: Users },
  { href: '/cobros', label: 'Cobros', icon: Wallet },
];

export default function Shell({ user, clinicName, logoutAction, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <header className="topbar">
        <button type="button" className="icon-btn" onClick={() => setOpen(true)} aria-label="Abrir menú">
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <Logo variant="monograma" />
        <ThemeToggle />
      </header>

      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <aside className="sidebar" data-open={open}>
        <div>
          <div className="sidebar__brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Logo />
            {open && (
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar menú">
                <X size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
          <p className="sidebar__clinic body-s muted">{clinicName}</p>
        </div>

        <nav className="nav" aria-label="Principal">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="nav__link"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar__foot">
          <div className="sidebar__user">
            <span className="body-s">{user.name}</span>
            <ThemeToggle />
          </div>
          <form action={logoutAction}>
            <button type="submit" className="mfl-btn mfl-btn--ghost mfl-btn--sm mfl-btn--inline">
              <LogOut size={16} strokeWidth={1.5} />
              Salir
            </button>
          </form>
          <p className="footer-sign">Hecho por MFL Systems</p>
        </div>
      </aside>

      <main className="content">
        <div className="content__inner">{children}</div>
      </main>
    </div>
  );
}
