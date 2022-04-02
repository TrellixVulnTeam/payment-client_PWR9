References: https://popper.js.org/docs/v2/

### Simple Popover

```jsx
const [showPopover, togglePopover] = React.useState(false);
const anchorRef = React.useRef(null);

const handlePopover = () => {
  togglePopover(!showPopover);
};

const popoverStyle = {
  padding: '1.2rem',
};

<div>
  <Button
    ref={anchorRef}
    fullWidth={false}
    onClick={handlePopover}
  >
    Open Popover
  </Button>
  {showPopover && (
    <Popover
      style={popoverStyle}
      anchorRef={anchorRef}
      onClose={handlePopover}
    >
      The content of the Popover.
    </Popover>
  )}
</div>
```

### Backdrop

```jsx

const [showPopover, togglePopover] = React.useState(false);
const [backdrop, setBackdrop] = React.useState(BackdropVariant.grey);
const anchorRef = React.useRef(null);

const handlePopover = (e, backdrop) => {
  anchorRef.current = e.target;
  setBackdrop(backdrop);
  togglePopover(!showPopover);
};

const popoverStyle = {
  padding: '1.2rem',
};

<div>
  <Button
    fullWidth={false}
    style={{ marginRight: '1.2rem' }}
    onClick={e => handlePopover(e, BackdropVariant.grey)}
  >
    Backdrop Grey
  </Button>
  <Button
    fullWidth={false}
    onClick={e => handlePopover(e, BackdropVariant.transparent)}
  >
    Backdrop Transparent
  </Button>
  {showPopover && (
    <Popover
      style={popoverStyle}
      anchorRef={anchorRef}
      backdrop={backdrop}
      placement={PopperPlacements.topStart}
      onClose={handlePopover}
    >
      The content of the Popover.
    </Popover>
  )}
</div>
```

### Placement

```jsx

const [showPopover, togglePopover] = React.useState(false);
const [placement, setPopoverPlacement] = React.useState(null);
const anchorRef = React.useRef(null);

const handlePlacement = (e, placement) => {
  anchorRef.current = e.target;
  setPopoverPlacement(placement);
  togglePopover(true);
};

const handlePopoverClose = () => {
  anchorRef.current = null;
  togglePopover(false);
};

const popoverStyle = {
  padding: '1.2rem',
};

<div>
  <Grid container spacing={6} justifyContent="center">
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.topStart)}>Top-Start</Button>
    </Grid>
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.top)}>Top</Button>
    </Grid>
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.topEnd)}>Top-End</Button>
    </Grid>
  </Grid>

  <Grid container spacing={6} justifyContent="center">
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.leftStart)}>Left-Start</Button>
    </Grid>
    <Grid item md={4} />
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.rightStart)}>Right-Start</Button>
    </Grid>
  </Grid>

  <Grid container spacing={6} justifyContent="center">
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.left)}>Left</Button>
    </Grid>
    <Grid item md={4} />
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.right)}>Right</Button>
    </Grid>
  </Grid>
  
  <Grid container spacing={6} justifyContent="center">
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.leftEnd)}>Left-End</Button>
    </Grid>
    <Grid item md={4} />
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.rightEnd)}>Right-End</Button>
    </Grid>
  </Grid>
  
  <Grid container spacing={6} justifyContent="center">
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.bottomStart)}>Bottom-Start</Button>
    </Grid>
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.bottom)}>Bottom</Button>
    </Grid>
    <Grid item md={2}>
      <Button onClick={e => handlePlacement(e, PopperPlacements.bottomEnd)}>Bottom-End</Button>
    </Grid>
  </Grid>
  
  {showPopover && (
    <Popover
      style={popoverStyle}
      anchorRef={anchorRef}
      placement={placement}
      onClose={handlePopoverClose}
    >
      The content of the Popover.
    </Popover>
  )}
</div>
```
