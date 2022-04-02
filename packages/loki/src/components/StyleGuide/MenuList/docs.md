### Simple menu list

```jsx

<Grid container>
  <Grid item md={4}>
    <Paper>
      <MenuList>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuList>
    </Paper>
  </Grid>
</Grid>
```

### Disabled items

```jsx

<Grid container>
  <Grid item md={4}>
    <Paper>
      <MenuList>
        <MenuItem disabled>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuList>
    </Paper>
  </Grid>
</Grid>
```

### Activated items

```jsx

<Grid container>
  <Grid item md={4}>
    <Paper>
      <MenuList>
        <MenuItem activated>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
        <MenuItem>Item 3</MenuItem>
      </MenuList>
    </Paper>
  </Grid>
</Grid>
```

### Direction

```jsx

const [direction, setDirection] = React.useState("row");

<div>
  <Grid container spacing={6} direction="row">
    <Grid item md={4}>
      <Select size="md" value={direction} onChange={setDirection}>
        <Option value="column">Column</Option>
        <Option value="column-reverse">Column-Reverse</Option>
        <Option value="row">Row</Option>
        <Option value="row-reverse">Row-Reverse</Option>
        <Option value="revert">Revert</Option>
      </Select>
    </Grid>
    <Grid item>
      <Paper>
        <MenuList direction={direction}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </MenuList>
      </Paper>
    </Grid>
  </Grid>
</div>
```

### Sizes

```jsx

const [size, setSize] = React.useState("md");

<div>
  <Grid container spacing={6} direction="row">
    <Grid item md={4}>
      <Select size="md" value={size} onChange={setSize}>
        <Option value="xs">Tiny</Option>
        <Option value="sm">Small</Option>
        <Option value="md">Medium</Option>
        <Option value="lg">Large</Option>
      </Select>
    </Grid>
    <Grid item container>
      <Grid item md={4}>
        <Paper>
          <MenuList>
            <MenuItem size={size}>Item 1</MenuItem>
            <MenuItem size={size}>Item 2</MenuItem>
            <MenuItem size={size}>Item 3</MenuItem>
          </MenuList>
        </Paper>
      </Grid>
    </Grid>
  </Grid>
</div>
```

### Menu with icon

```jsx

const iconStyle = {
  marginRight: '1.2rem',
};

<Grid container>
  <Grid item md={4}>
    <Paper>
      <MenuList>
        <MenuItem>
          <Icon component={Info} style={iconStyle} /> Item 1
        </MenuItem>
        <MenuItem>
          <Icon component={Folder} style={iconStyle} /> Item 2
        </MenuItem>
        <MenuItem>
          <Icon component={Heart} style={iconStyle} /> Item 3
        </MenuItem>
      </MenuList>
    </Paper>
  </Grid>
</Grid>
```
