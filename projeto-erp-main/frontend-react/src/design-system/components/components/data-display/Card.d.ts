import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Inner padding (CSS value). Default var(--space-6) = 24px. */
  padding?: string;
  children?: React.ReactNode;
}

/** White surface container — 8px radius, hairline border, soft shadow. */
export function Card(props: CardProps): JSX.Element;

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned actions (buttons, filters). */
  actions?: React.ReactNode;
}

/** Title + actions header row with a bottom divider, for use inside Card. */
export function CardHeader(props: CardHeaderProps): JSX.Element;
