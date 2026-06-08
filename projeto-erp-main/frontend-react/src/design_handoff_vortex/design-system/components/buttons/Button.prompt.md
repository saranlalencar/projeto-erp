The primary action control. Navy `primary` for the main action, `secondary` (outlined) for cancel/back, `ghost` for low-emphasis, `danger` for destructive.

```jsx
<Button variant="primary" leadingIcon={<Icon name="plus" size={17} />}>Novo Cliente</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger" size="sm">Excluir</Button>
```

Props: `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg), `fullWidth`, `disabled`, `leadingIcon`, `trailingIcon`. Radius is 6px per the button token.
