import * as React from 'react';

export interface TopbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page title. */
  title: React.ReactNode;
  /** Small label above the title (e.g. module / breadcrumb). */
  breadcrumb?: React.ReactNode;
  /** Right-aligned controls (IconButtons, Avatar). */
  actions?: React.ReactNode;
}

/** 64px application top bar with title and right-aligned actions. */
export function Topbar(props: TopbarProps): JSX.Element;
