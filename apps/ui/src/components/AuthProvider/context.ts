import { createContext } from 'react';
import type { AuthProviderState } from '@/components/AuthProvider/types.ts';

export const AuthProviderContext = createContext<AuthProviderState | null>(null);
