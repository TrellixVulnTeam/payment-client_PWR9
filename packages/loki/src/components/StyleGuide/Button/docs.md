## Button
Buttons allow users to take actions, and make choices, with a single tap.

### Interactive demo
This demo lets you preview the button component, its variations, and configuration options.

#### Primary (default)

```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';

<Button variant={ButtonVariants.primary} fullWidth={false}>
  Button
</Button>
```

#### Secondary

```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';

<Button variant={ButtonVariants.secondary} fullWidth={false}>
  Button
</Button>
```

#### Ghost

```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';

<Button variant={ButtonVariants.ghost} fullWidth={false}>
  Button
</Button>
```

#### Invert

```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';

<Button variant={ButtonVariants.invert} fullWidth={false}>
  Button
</Button>
```

### Disabled

```tsx

<Button fullWidth={false} disabled>
  Button
</Button>
```

### Loading

```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';

<Button fullWidth={false} loading>
  Button
</Button>
```

**Interactive**
```tsx
import { useEffect, useState } from 'react';
import { ButtonVariants } from 'components/StyleGuide/Button';

const [loading, setLoading] = useState(false);
const onClick = () => {
  setLoading(true);
};

useEffect(() => {
  const timeout = setTimeout(() => {
    setLoading(false);
  }, 2000);

  return () => {
    clearTimeout(timeout);
  }
});

<Button fullWidth={false} loading={loading} onClick={onClick}>
  Button
</Button>
```

### Icon Button
```tsx

import { Edit } from 'assets/icons/ILT';

<Button fullWidth={false} icon={Edit}/>
```

### Sizes

```tsx

import { ButtonSizes } from 'components/StyleGuide/Button';
import { Grid } from '@material-ui/core';

<Grid container spacing={2} alignItems="end">
  <Grid item md={2}>
    <Button size={ButtonSizes.lg}>
      Large
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button size={ButtonSizes.md}>
      Medium
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button size={ButtonSizes.sm}>
      Small
    </Button>
  </Grid>
</Grid>

```


### All Variants

**Interactive**
```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';
import { Grid } from '@material-ui/core';

<Grid container spacing={2}>
  <Grid item md={2}>
    <Button variant={ButtonVariants.primary}>
      Primary
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.secondary}>
      Secondary
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.ghost}>
      Ghost
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.invert}>
      Invert
    </Button>
  </Grid>
</Grid>
```

**Disabled**
```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';
import { Grid } from '@material-ui/core';

<Grid container spacing={2}>
  <Grid item md={2}>
    <Button variant={ButtonVariants.primary} disabled>
      Primary
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.secondary} disabled>
      Secondary
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.ghost} disabled>
      Ghost
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.invert} disabled>
      Invert
    </Button>
  </Grid>
</Grid>
```

**Loading**
```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';
import { Grid } from '@material-ui/core';

<Grid container spacing={2}>
  <Grid item md={2}>
    <Button variant={ButtonVariants.primary} loading>
      Primary
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.secondary} loading>
      Secondary
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.ghost} loading>
      Ghost
    </Button>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.invert} loading>
      Invert
    </Button>
  </Grid>
</Grid>
```

**Icon Button**
```tsx
import { ButtonVariants } from 'components/StyleGuide/Button';
import { Grid } from '@material-ui/core';
import { Edit } from 'assets/icons/ILT';

<Grid container spacing={2}>
  <Grid item md={2}>
    <Button variant={ButtonVariants.primary} icon={Edit}/>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.secondary} icon={Edit}/>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.ghost} icon={Edit}/>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.invert} icon={Edit}/>
  </Grid>
</Grid>
```

**Start icon Button**
```tsx

import { ButtonVariants } from 'components/StyleGuide/Button';
import { Grid } from '@material-ui/core';
import { Edit } from 'assets/icons/ILT';

<Grid container spacing={2}>
  <Grid item md={2}>
    <Button variant={ButtonVariants.primary} startIcon={Edit}/>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.secondary} startIcon={Edit}/>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.ghost} startIcon={Edit}/>
  </Grid>
  <Grid item md={2}>
    <Button variant={ButtonVariants.invert} startIcon={Edit}/>
  </Grid>
</Grid>
```