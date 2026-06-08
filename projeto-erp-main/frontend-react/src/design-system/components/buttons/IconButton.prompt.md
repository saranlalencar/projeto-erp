Icon-only square button for compact spots — table row actions, topbar (bell, settings).

```jsx
<IconButton icon={<Icon name="edit" size={16} />} label="Editar" />
<IconButton icon={<Icon name="bell" size={18} />} variant="ghost" label="Notificações" />
```

Variants: `ghost` (default, transparent) and `outline` (bordered). Always pass `label` for accessibility.
