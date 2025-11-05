import { createContext } from 'react';
import type { ThemeProviderState } from '@/components/ThemeProvider/types.ts';

export const ThemeProviderContext = createContext<ThemeProviderState | null>(null);
