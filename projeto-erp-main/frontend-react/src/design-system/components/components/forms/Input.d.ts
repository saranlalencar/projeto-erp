import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label rendered above the control. */
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — turns the border red and replaces the hint. */
  error?: string;
  /** Icon shown inside the field on the left (e.g. <Icon name="search" />). */
  leadingIcon?: React.ReactNode;
  /** Style for the wrapping column (label + field). */
  containerStyle?: React.CSSProperties;
}

/** Labeled text input with focus ring, leading icon and error state. */
export function Input(props: InputProps): JSX.Element;
