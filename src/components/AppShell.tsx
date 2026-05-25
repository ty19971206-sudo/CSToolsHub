import type { ReactNode } from 'react';
import AppShellHeader from './AppShellHeader';

export default function AppShell({
  children,
  fullHeight = false,
}: {
  children: ReactNode;
  fullHeight?: boolean;
}) {
  return (
    <div className={fullHeight ? 'shell shell-full' : 'shell'}>
      <div className="page-ambient" aria-hidden="true">
        <div className="page-ambient-spot" />
      </div>
      <AppShellHeader />
      <main className="shell-main">{children}</main>
    </div>
  );
}
