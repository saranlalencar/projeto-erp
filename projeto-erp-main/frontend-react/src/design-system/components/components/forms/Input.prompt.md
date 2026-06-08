Labeled text input — the form workhorse. 6px radius, navy focus ring, optional leading icon and error state.

```jsx
<Input label="E-mail" type="email" placeholder="contato@empresa.com" />
<Input leadingIcon={<Icon name="search" size={16} />} placeholder="Buscar clientes..." />
<Input label="Valor" error="Campo obrigatório" />
```

Props: `label`, `hint`, `error`, `leadingIcon`, plus all native input attributes. Use without `label` for inline search boxes.
