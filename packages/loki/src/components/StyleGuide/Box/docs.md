### Basic usage

#### Margin

```tsx

import Box from 'components/StyleGuide/Box';
import Paper from 'components/StyleGuide/Paper';

const paperStyle = {
  padding: "16px",
  textAlign: "center",
};

<Box m={2}>
  <Paper elevation={1} style={paperStyle}>
    m=2
  </Paper>
</Box>;
```

#### Padding

```tsx
import Box from 'components/StyleGuide/Box';
import Paper from 'components/StyleGuide/Paper';

const paperStyle = {
  padding: "16px",
  textAlign: "center",
};

<Box p={2}>
  <Paper elevation={1} style={paperStyle}>
    p=2
  </Paper>
</Box>;
```

### Advanced usage

```tsx
import Box from 'components/StyleGuide/Box';
import Paper from 'components/StyleGuide/Paper';

const paperStyle = {
  padding: "16px",
  textAlign: "center",
};

<div>
  <Box m={1}>
    <Paper elevation={1} style={paperStyle}>
      m=1
    </Paper>
  </Box>

  <Box mx={6}>
    <Paper elevation={1} style={paperStyle}>
      mx=6
    </Paper>
  </Box>

  <Box my={6}>
    <Paper elevation={1} style={paperStyle}>
      my=6
    </Paper>
  </Box>

  <Box mx={2} marginBottom={6}>
    <Paper elevation={1} style={paperStyle}>
      mx=2,marginBottom=6
    </Paper>
  </Box>

  <Box p={1}>
    <Paper elevation={1} style={paperStyle}>
      p=1
    </Paper>
  </Box>

  <Box px={6}>
    <Paper elevation={1} style={paperStyle}>
      px=6
    </Paper>
  </Box>

  <Box py={6}>
    <Paper elevation={1} style={paperStyle}>
      my=6
    </Paper>
  </Box>
</div>;
```

### Use with breakpoint

```tsx
import Box from 'components/StyleGuide/Box';
import Paper from 'components/StyleGuide/Paper';

const paperStyle = {
  padding: "16px",
  textAlign: "center",
};

<Box xl={{ p: 5 }} lg={{ p: 4 }} md={{ p: 3 }} sm={{ p: 2 }} xs={{ p: 1 }}>
  <Paper elevation={1} style={paperStyle}>
    xl: p=2, lg: p=3, md: p=2, sm: p=1, xs: p=0
  </Paper>
</Box>;
```

### Use with Grid

As you know, Grid has limitation with negative margin. In that case, we can use Box component to fix that.

```html
<body>
  <div style={{ padding: 20 }}>
    <Grid container spacing={5}>
      //...
    </Grid>
  </div>
</body>
```

```html
<body>
  <Box p={5}>
    <Grid container spacing={5}>
      //...
    </Grid>
  </Box>
</body>
```

```tsx
import Box from 'components/StyleGuide/Box';
import Paper from 'components/StyleGuide/Paper';
import Grid from 'components/StyleGuide/Grid';

const paperStyle = {
  padding: "16px",
  textAlign: "center",
};

<Box p={3}>
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Paper elevation={1} style={paperStyle}>
        xs=12
      </Paper>
    </Grid>
    <Grid item xs={6}>
      <Paper elevation={1} style={paperStyle}>
        xs=6
      </Paper>
    </Grid>
    <Grid item xs={6}>
      <Paper elevation={1} style={paperStyle}>
        xs=6
      </Paper>
    </Grid>
    <Grid item xs={3}>
      <Paper elevation={1} style={paperStyle}>
        xs=3
      </Paper>
    </Grid>
    <Grid item xs={3}>
      <Paper elevation={1} style={paperStyle}>
        xs=3
      </Paper>
    </Grid>
    <Grid item xs={3}>
      <Paper elevation={1} style={paperStyle}>
        xs=3
      </Paper>
    </Grid>
    <Grid item xs={3}>
      <Paper elevation={1} style={paperStyle}>
        xs=3
      </Paper>
    </Grid>
  </Grid>
</Box>;
```
