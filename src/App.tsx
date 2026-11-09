import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { CreateQuotePage } from './pages/CreateQuote/CreateQuotePage';
import { SupplierQuotePage } from './pages/SupplierQuote/SupplierQuotePage';
import { QuoteComparisonPage } from './pages/QuoteComparison/QuoteComparisonPage';
import { OrderConfirmationPage } from './pages/OrderConfirmation/OrderConfirmationPage';
import { QuoteHistoryPage } from './pages/QuoteHistory/QuoteHistoryPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/supply-chain" element={<DashboardPage />} />
          <Route path="/create-quote" element={<CreateQuotePage />} />
          <Route path="/supplier-quote" element={<SupplierQuotePage />} />
          <Route path="/supplier-quote/:id" element={<SupplierQuotePage />} />
          <Route path="/compare" element={<QuoteComparisonPage />} />
          <Route path="/compare/:id" element={<QuoteComparisonPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/history" element={<QuoteHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
