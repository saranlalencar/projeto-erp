import * as React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
}

/** Labeled checkbox filled with the brand primary when checked. */
export function Checkbox(props: CheckboxProps): JSX.Element;
