import * as React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** On/off toggle — navy track when on. `onChange` receives the next boolean. */
export function Switch(props: SwitchProps): JSX.Element;
