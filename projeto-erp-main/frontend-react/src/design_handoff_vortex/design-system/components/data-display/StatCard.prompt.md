Dashboard KPI tile — tinted icon square, big tabular number, caption.

```jsx
<StatCard icon={<Icon name="users" size={24} />} value="248" label="Clientes" tone="primary" delta="+12%" />
```

Tones tint the icon tile: primary, success, warning, danger, neutral. Lay several out in a `repeat(4, 1fr)` grid with `gap: 16px`.
