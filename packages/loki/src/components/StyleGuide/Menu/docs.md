### Simple menu

```jsx

const ref = React.useRef();
const [open, toggle] = React.useState();

const handleCloseMenu = () => toggle(false);
const handleOpenMenu = () => toggle(true);

<div>
  <Button ref={ref} fullWidth={false} onClick={handleOpenMenu}>
    Open menu
  </Button>
  {open && (
    <Menu anchorRef={ref} onClose={handleCloseMenu}>
      <MenuItem>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
      <MenuItem>Item 3</MenuItem>
      <MenuItem>Item 4</MenuItem>
    </Menu>
  )}
</div>
```
