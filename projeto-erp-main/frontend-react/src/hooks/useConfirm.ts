import { useState, useCallback } from 'react';

type State = {
  open: boolean;
  message: string;
  title?: string;
  confirmLabel?: string;
  resolve?: (v: boolean) => void;
};

export function useConfirm() {
  const [state, setState] = useState<State>({ open: false, message: '' });

  const confirm = useCallback(
    (message: string, opts?: { title?: string; confirmLabel?: string }) =>
      new Promise<boolean>((resolve) => {
        setState({ open: true, message, title: opts?.title, confirmLabel: opts?.confirmLabel, resolve });
      }),
    []
  );

  const handleConfirm = useCallback(() => {
    setState((prev) => { prev.resolve?.(true); return { open: false, message: '' }; });
  }, []);

  const handleCancel = useCallback(() => {
    setState((prev) => { prev.resolve?.(false); return { open: false, message: '' }; });
  }, []);

  return {
    confirm,
    dialogProps: {
      open: state.open,
      message: state.message,
      title: state.title,
      confirmLabel: state.confirmLabel,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    } as const,
  };
}
