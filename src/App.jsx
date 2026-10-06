import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PhoneFrame } from './components/shared/PhoneFrame';
import { ToastContainer } from './components/ui/Toast';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <AppRoutes />
      </PhoneFrame>
      <ToastContainer />
    </BrowserRouter>
  );
}
