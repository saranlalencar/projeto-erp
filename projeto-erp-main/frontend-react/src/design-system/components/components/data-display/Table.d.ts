import * as React from 'react';

export interface TableColumn<T = any> {
  /** Unique column id; also the data key used when `render` is omitted. */
  key: string;
  /** Header label. */
  header: React.ReactNode;
  /** Cell alignment. Default 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Optional fixed width (CSS value). */
  width?: string;
  /** Custom cell renderer; receives the row object. */
  render?: (row: T) => React.ReactNode;
}

/**
 * @startingPoint section="Components" subtitle="ERP data table with column defs" viewport="700x320"
 */
export interface TableProps<T = any> {
  /** Column definitions. */
  columns: TableColumn<T>[];
  /** Row objects. */
  data: T[];
  /** Field used as React key. Default 'id'. */
  rowKey?: string;
  /** Click handler per row (adds pointer + hover affordance). */
  onRowClick?: (row: T) => void;
  /** Empty-state message. */
  empty?: React.ReactNode;
}

/** ERP list table: uppercase slate header, hairline dividers, row hover. */
export function Table<T = any>(props: TableProps<T>): JSX.Element;
