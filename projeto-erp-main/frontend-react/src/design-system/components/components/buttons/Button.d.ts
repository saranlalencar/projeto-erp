import * as React from 'react';

/**
 * @startingPoint section="Components" subtitle="Primary, secondary, ghost & danger actions" viewport="700x220"
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style. Default 'primary'. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size preset. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Disable the button. */
  disabled?: boolean;
  /** Icon element rendered before the label (e.g. <Icon name="plus" />). */
  leadingIcon?: React.ReactNode;
  /** Icon element rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/** Brand action button with navy primary, hover-darken, and four variants. */
export function Button(props: ButtonProps): JSX.Element;
