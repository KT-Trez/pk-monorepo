// import { CircleAlert, CircleCheck, CircleX, Info } from 'lucide-react';
import { SnackbarProvider } from 'notistack';
import type { ReactNode, Ref } from 'react';

type CustomSnackbarProviderProps = {
  children: ReactNode;
  ref?: Ref<SnackbarProvider>;
};

export const CustomSnackbarProvider = ({ children, ref }: CustomSnackbarProviderProps) => {
  // todo: customize snackbar appearance
  // const Components = useMemo<Partial<Record<VariantType, React.ComponentType>>>(
  //   () => ({
  //     error: Alert,
  //     info: Alert,
  //     success: Alert,
  //     warning: Alert,
  //   }),
  //   [],
  // );
  //
  // const iconVariant = useMemo<Partial<Record<VariantType, ReactNode>>>(
  //   () => ({
  //     error: <CircleX />,
  //     info: <Info />,
  //     success: <CircleCheck />,
  //     warning: <CircleAlert />,
  //   }),
  //   [],
  // );

  return (
    <SnackbarProvider autoHideDuration={10000} /* Components={Components} iconVariant={iconVariant} */ ref={ref}>
      {children}
    </SnackbarProvider>
  );
};
