import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './layouts/AuthGuard';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { SplashOnboarding } from './pages/SplashOnboarding';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { HomeDashboard } from './pages/HomeDashboard';
import { TransferFlow } from './pages/TransferFlow';
import { AirtimeDataFlow } from './pages/AirtimeDataFlow';
import { BillsFlow } from './pages/BillsFlow';
import { AddMoneyFlow } from './pages/AddMoneyFlow';
import { TransactionHistory } from './pages/TransactionHistory';
import { SavingsFlow } from './pages/SavingsFlow';
import { CardsPage } from './pages/CardsPage';
import { RewardsPage } from './pages/RewardsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/onboarding" element={<SplashOnboarding />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected App Routes */}
      <Route element={<AuthGuard />}>
        {/* Main Tabs (with bottom navigation) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Dedicated Transaction Flows */}
        <Route path="/transfer" element={<TransferFlow />} />
        <Route path="/airtime-data" element={<AirtimeDataFlow />} />
        <Route path="/bills" element={<BillsFlow />} />
        <Route path="/add-money" element={<AddMoneyFlow />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/savings" element={<SavingsFlow />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Fallback wildcard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
