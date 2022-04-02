### Simple ListItemAction

```jsx

<Grid container spacing={6}>
  <Grid item md={3}>
    <Paper>
      <List>
        <ListItem>
          <ListItemIcon icon={Inbox} />
          <ListItemText>Inbox</ListItemText>
          <ListItemAction icon={TrashBin} />
        </ListItem>
        <ListItem>
          <ListItemIcon icon={EditInBox} />
          <ListItemText>Drafts</ListItemText>
          <ListItemAction icon={TrashBin} />
        </ListItem>
      </List>
    </Paper>
  </Grid>
</Grid>
```
