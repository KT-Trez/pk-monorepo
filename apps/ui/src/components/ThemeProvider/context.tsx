import type { ThemeProviderState } from '@/components/ThemeProvider/types.ts';
import { createContext } from 'react';

export const ThemeProviderContext = createContext<ThemeProviderState | null>(null);
