Centered dialog for create/edit forms and confirmations. Scrim is translucent slate; closes on scrim click or the X.

```jsx
<Modal
  title="Nova Conta"
  onClose={() => setOpen(false)}
  footer={<>
    <Button variant="secondary" onClick={close}>Cancelar</Button>
    <Button onClick={save}>Salvar</Button>
  </>}
>
  <Input label="Descrição" />
</Modal>
```

12px radius, header divider, footer on a sunken bar. Default width 440px — pass `width` for wider forms.
