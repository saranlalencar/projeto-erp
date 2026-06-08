The base white surface for everything — tables, forms, panels. 8px radius, hairline border, soft shadow.

```jsx
<Card>
  <CardHeader title="Contas a Receber" subtitle="Junho 2026" actions={<Button size="sm">Nova</Button>} />
  …content…
</Card>
```

Use `padding="0"` when wrapping an edge-to-edge table. `CardHeader` gives a titled header row with optional actions.
