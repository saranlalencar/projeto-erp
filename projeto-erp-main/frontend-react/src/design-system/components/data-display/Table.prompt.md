Column-driven data table for all list views (Clientes, Estoque, Financeiro). Wrap it in a `<Card padding="0">` so the header fill meets the card edge.

```jsx
<Table
  columns={[
    { key: 'nome', header: 'Nome', render: r => <strong>{r.nome}</strong> },
    { key: 'valor', header: 'Valor', align: 'right' },
    { key: 'status', header: 'Status', render: r => <Badge tone="success">Pago</Badge> },
  ]}
  data={contas}
/>
```

Each column may set `align`, `width`, and a `render(row)` function. `onRowClick` adds a hover/pointer affordance. Numbers should use tabular alignment (align: 'right').
