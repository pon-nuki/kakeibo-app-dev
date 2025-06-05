// src/types/ErrorBoundaryTypes.d.ts

import { ReactNode } from 'react';

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}