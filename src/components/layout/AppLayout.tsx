import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNavBar } from './BottomNavBar';

export const AppLayout: React.FC = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col antialiased">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <BottomNavBar />
    </div>
  );
};
