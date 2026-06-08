The dark, fixed 240px navigation rail — VORTEX's signature chrome. Compose with SidebarItem rows; active row gets the navy-900 fill.

```jsx
<Sidebar brand="VORTEX" footer={<Button variant="ghost" fullWidth leadingIcon={<Icon name="logout" size={16}/>}>Sair</Button>}>
  <SidebarItem icon={<Icon name="dashboard" size={18}/>} label="Dashboard" active />
  <SidebarItem icon={<Icon name="users" size={18}/>} label="Clientes" />
  <SidebarItem icon={<Icon name="package" size={18}/>} label="Estoque" />
</Sidebar>
```

The logo tile is the navy ⚡-mark in primary blue. Sidebar fills its parent's height; place it in a flex/grid app shell beside the Topbar + content.
