import React from 'react';

/**
 * Data table matching the ERP list views: uppercase slate header on a sunken
 * fill, hairline row dividers, hover highlight. Column defs drive rendering.
 */
export function Table({ columns, data, rowKey = 'id', onRowClick, empty = 'Nenhum registro encontrado.', style, ...rest }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <thead>
        <tr style={{ background: 'var(--surface-sunken)' }}>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: c.align ?? 'left',
                padding: '11px 16px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                borderBottom: '1px solid var(--border-default)',
                whiteSpace: 'nowrap',
                width: c.width,
              }}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-sm)' }}
            >
              {empty}
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{
                borderBottom: '1px solid var(--slate-100)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background var(--duration-fast) var(--ease-standard)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-50)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    padding: '13px 16px',
                    fontSize: 'var(--text-base)',
                    color: 'var(--text-body)',
                    textAlign: c.align ?? 'left',
                    verticalAlign: 'middle',
                  }}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
