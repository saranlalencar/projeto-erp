import * as React from 'react';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element shown in the tinted tile (e.g. <Icon name="users" />). */
  icon?: React.ReactNode;
  /** Primary metric value. */
  value: React.ReactNode;
  /** Caption below the value. */
  label: React.ReactNode;
  /** Tile color tone. Default 'primary'. */
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Optional trend string (e.g. "+12%"). */
  delta?: React.ReactNode;
}

/** Dashboard KPI card: tinted icon tile + big tabular value + label. */
export function StatCard(props: StatCardProps): JSX.Element;
