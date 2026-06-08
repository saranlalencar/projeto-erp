import * as React from 'react';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is shown. Default true. */
  open?: boolean;
  /** Header title; omit for a chrome-less dialog. */
  title?: React.ReactNode;
  /** Close handler — wired to the X button and scrim click. */
  onClose?: () => void;
  /** Footer content (action buttons). Sits on a sunken bar. */
  footer?: React.ReactNode;
  /** Dialog width in px. Default 440. */
  width?: number;
  children?: React.ReactNode;
}

/** Centered dialog over a slate scrim. 12px radius, header/body/footer slots. */
export function Modal(props: ModalProps): JSX.Element | null;
