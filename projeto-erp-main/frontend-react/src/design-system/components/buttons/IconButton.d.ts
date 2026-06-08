import * as React from 'react';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon element to render (e.g. <Icon name="edit" />). */
  icon: React.ReactNode;
  /** Style. Default 'ghost'. */
  variant?: 'ghost' | 'outline';
  /** Size preset. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (also used as tooltip title). */
  label?: string;
  disabled?: boolean;
}

/** Square, icon-only button for table actions and topbar controls. */
export function IconButton(props: IconButtonProps): JSX.Element;
