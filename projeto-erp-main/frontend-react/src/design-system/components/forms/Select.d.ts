import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Options as strings or {value,label}. Alternatively pass <option> children. */
  options?: (string | SelectOption)[];
  containerStyle?: React.CSSProperties;
}

/** Native select styled to match Input, with a chevron indicator. */
export function Select(props: SelectProps): JSX.Element;
