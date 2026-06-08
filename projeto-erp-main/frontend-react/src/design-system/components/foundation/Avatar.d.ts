import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full name — initials are derived from the first two words. */
  name: string;
  /** Diameter preset. Default 'md' (36px). */
  size?: 'sm' | 'md' | 'lg';
  /** Background color. Defaults to brand primary. */
  color?: string;
}

/** Circular initials avatar on the brand primary. */
export function Avatar(props: AvatarProps): JSX.Element;
