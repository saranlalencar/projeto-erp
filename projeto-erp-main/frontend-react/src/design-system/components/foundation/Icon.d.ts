import * as React from 'react';

export type IconName =
  | 'dashboard' | 'users' | 'package' | 'cart' | 'wallet' | 'shield' | 'logout'
  | 'plus' | 'search' | 'edit' | 'trash' | 'check' | 'x' | 'filter'
  | 'chevronRight' | 'chevronDown' | 'chevronLeft' | 'arrowRight'
  | 'bell' | 'settings' | 'more' | 'mail' | 'trendingUp'
  | 'clipboard' | 'refresh' | 'circleCheck' | 'circleX' | 'building';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Which glyph to render (Lucide-style stroke icon). */
  name: IconName;
  /** Square size in px. Default 18. */
  size?: number;
  /** Stroke width. Default 2. */
  strokeWidth?: number;
  /** Stroke color. Defaults to currentColor so it inherits text color. */
  color?: string;
}

/** Lucide-style line icon. Inherits `currentColor` by default. */
export function Icon(props: IconProps): JSX.Element | null;
