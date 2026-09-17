import React from 'react';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  background?: string;
}

export function AppShell({ children, background = 'bg-navy' }: AppShellProps) {
  return (
    <div className={`min-h-full w-full ${background}`}>
      <TopNav />
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>);

}