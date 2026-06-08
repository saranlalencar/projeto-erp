import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone. Default 'neutral'. */
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  /** Show a leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
}

/** Pill-shaped status badge using the semantic color pairs. */
export function Badge(props: BadgeProps): JSX.Element;
