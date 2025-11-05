import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { type ThemeProviderState, type ThemeVariant, themeVariant } from '@/components/ThemeProvider/types.ts';
import { ThemeProviderContext } from './context.ts';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: ThemeVariant;
  storageKey?: string;
};

export const ThemeProvider = ({
  children,
  defaultTheme = themeVariant.System,
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeVariant>(
    () => (localStorage.getItem(storageKey) as ThemeVariant) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(themeVariant.Dark, themeVariant.Light);

    if (theme === themeVariant.System) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? themeVariant.Dark
        : themeVariant.Light;

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      setTheme: theme => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
      theme,
    }),
    [storageKey, theme],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
};
