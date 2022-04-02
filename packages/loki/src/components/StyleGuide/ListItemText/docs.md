### Simple ListItemText

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

### Text sizes

```jsx

<Grid container spacing={6}>
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Tiny</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem>
            <ListItemText size="xs">Inbox</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText size="xs">Drafts</ListItemText>
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
          <ListItem>
            <ListItemText size="sm">Inbox</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText size="sm">Drafts</ListItemText>
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
          <ListItem>
            <ListItemText size="md">Inbox</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText size="md">Drafts</ListItemText>
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
          <ListItem>
            <ListItemText size="lg">Inbox</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText size="lg">Drafts</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
</Grid>
```

### Typos

```jsx

<Grid container spacing={6}>
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Typo type - Link</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem>
            <ListItemText type="link">Inbox</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
  
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Typo variant - Body 2</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem>
            <ListItemText variant="body1">Inbox</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
  
  <Grid item md={3} container spacing={4} direction="column">
    <Grid item>
      <Typography variant="subtitle2">Typo weight - Bold</Typography>
    </Grid>
    
    <Grid item>
      <Paper>
        <List>
          <ListItem>
            <ListItemText weight="bold">Inbox</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Grid>
  </Grid>
</Grid>
```

### Inset

```jsx

<Grid container spacing={6}>
  <Grid item md={3}>
    <Paper>
      <List>
        <ListItem>
          <ListItemText>Chelsea Otakan</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText inset={true}>Eric Hoffman</ListItemText>
        </ListItem>
      </List>
    </Paper>
  </Grid>
</Grid>
```
