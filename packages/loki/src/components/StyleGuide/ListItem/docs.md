### Simple ListItem

```jsx

<Grid container spacing={6}>
  <Grid item md={3}>
    <Paper>
      <List>
        <ListItem>
          <ListItemText>Inbox</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>Drafts</ListItemText>
        </ListItem>
      </List>
    </Paper>
  </Grid>
</Grid>
```

### Activated

```jsx

<Grid container spacing={6}>
  <Grid item md={3}>
    <Paper>
      <List>
        <ListItem activated>
          <ListItemText>Inbox</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>Drafts</ListItemText>
        </ListItem>
      </List>
    </Paper>
  </Grid>
</Grid>
```

### Disabled

```jsx

<Grid container spacing={6}>
  <Grid item md={3}>
    <Paper>
      <List>
        <ListItem disabled>
          <ListItemText>Inbox</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>Drafts</ListItemText>
        </ListItem>
      </List>
    </Paper>
  </Grid>
</Grid>
```

### Sizes

```jsx

<Grid container spacing={6}>
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Tiny</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem size="xs">
            <ListItemText>Inbox</ListItemText>
          </ListItem>
          <ListItem size="xs">
            <ListItemText>Drafts</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
  
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Small</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem size="sm">
            <ListItemText>Inbox</ListItemText>
          </ListItem>
          <ListItem size="sm">
            <ListItemText>Drafts</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
  
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Medium</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem size="md">
            <ListItemText>Inbox</ListItemText>
          </ListItem>
          <ListItem size="md">
            <ListItemText>Drafts</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
  
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Large</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem size="lg">
            <ListItemText>Inbox</ListItemText>
          </ListItem>
          <ListItem size="lg">
            <ListItemText>Drafts</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
</Grid>
```
### Nested

```jsx

const [isOpen, toggleList] = React.useState(false);

const handleToggleList = () => {
  toggleList(!isOpen);
};

<Grid container spacing={6}>
  <Grid item md={3}>
    <Paper>
      <List>
        <ListItem
          open={isOpen}
          activated={isOpen}
          onClick={handleToggleList}
        >
          <ListItemText>Inbox</ListItemText>
        </ListItem>
        <Collapse in={isOpen}>
          <List>
            <ListItem>
              <ListItemText>Starred</ListItemText>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Paper>
  </Grid>
</Grid>
```
