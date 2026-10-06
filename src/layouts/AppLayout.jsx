import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/shared/BottomNav';

export function AppLayout() {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-full">
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
