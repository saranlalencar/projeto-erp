import * as React from 'react';

/**
 * @startingPoint section="Navigation" subtitle="Dark 240px ERP navigation rail" viewport="260x560"
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Wordmark shown next to the logo tile. Default 'VORTEX'. */
  brand?: string;
  /** SidebarItem rows. */
  children?: React.ReactNode;
  /** Pinned footer content (profile, logout). */
  footer?: React.ReactNode;
}

/** Fixed dark navigation rail with brand header and footer slot. */
export function Sidebar(props: SidebarProps): JSX.Element;

export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading icon element. */
  icon?: React.ReactNode;
  /** Row label. */
  label: React.ReactNode;
  /** Highlight as the current route. */
  active?: boolean;
}

/** A single navigation row inside Sidebar. */
export function SidebarItem(props: SidebarItemProps): JSX.Element;
