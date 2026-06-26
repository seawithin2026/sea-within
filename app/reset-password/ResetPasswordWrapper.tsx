'use client';

import { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordPage';

export default function ResetPasswordWrapper() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
