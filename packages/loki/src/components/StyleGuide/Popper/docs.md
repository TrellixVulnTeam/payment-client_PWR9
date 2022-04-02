<h3>Usage</h3>

```jsx

const [anchorEl, setAnchorEl] = React.useState(null);
function handleClick(event) {
  setAnchorEl(anchorEl ? null : event.currentTarget);
}

<div>
  <Button variant={ButtonVariants.primary} onClick={handleClick} fullWidth={false}>
    Open Popper
  </Button>
  <Popper anchorEl={anchorEl} popperOptions={{'placement':PopperPlacements.top}}>
    <Paper>
      <Typography>The content of the Popper</Typography>
    </Paper>
  </Popper>
</div>

```
